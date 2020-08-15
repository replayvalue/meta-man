import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { MetaManService } from "./meta-man.service";
import { MetaManModule } from "./meta-man.module";
import { Routes, ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";

const imageURL = "https://speedwagon.foundation/Speedwagon_Foundation.png";

@Component({
  selector: "lib-root",
  template: `<router-outlet></router-outlet>`,
})
class AppComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly metaManService: MetaManService
  ) {}

  ngOnInit(): void {
    this.metaManService.listenForRouteChange(this.route);
  }
}

@Component({
  selector: "lib-stub",
})
class StubComponent {}

const routes: Routes = [
  {
    path: "",
    component: StubComponent,
    data: {
      title: "Home",
      description: "This is the home page",
      image: imageURL,
    },
  },
  {
    path: "other",
    component: StubComponent,
    data: {
      title: "Other",
      description: "This is the other page",
      image: null,
    },
  },
  {
    path: "another",
    component: StubComponent,
    data: {
      title: "Other",
      description: null,
      image: "https://example.com/image.jpg",
    },
  },
];

describe("MetaManService", () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let spyTitle: jasmine.SpyObj<Title>;
  let spyMeta: jasmine.SpyObj<Meta>;

  describe("with a component mounting", () => {
    beforeEach(async(() => {
      spyTitle = jasmine.createSpyObj("Title", ["setTitle"]);
      spyMeta = jasmine.createSpyObj("Meta", [
        "addTag",
        "updateTag",
        "removeTag",
      ]);

      TestBed.configureTestingModule({
        declarations: [AppComponent, StubComponent],
        imports: [
          RouterTestingModule.withRoutes(routes, {
            paramsInheritanceStrategy: "always",
          }),
          MetaManModule.forRoot({
            baseTitle: "Replay Value",
            host: "https://getreplayvalue.com",
          }),
        ],
        providers: [
          { provide: Title, useValue: spyTitle },
          { provide: Meta, useValue: spyMeta },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      router = TestBed.inject(Router);
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });
    it("should be created", () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it("updates tags on first route", () => {
      return fixture.ngZone?.run(() =>
        router.navigate([""]).then(() => {
          validateHomePageTags();
        })
      );
    });

    it("clears tags when explicitly null", () => {
      return fixture.ngZone?.run(() =>
        router
          .navigate([""])
          .then(() => {
            validateHomePageTags();
            return router.navigate(["other"]);
          })
          .then(() => {
            expect(spyMeta.removeTag).toHaveBeenCalledWith(
              "property='og:image'"
            );
            resetSpys();
            return router.navigate(["another"]);
          })
          .then(() => {
            expect(spyMeta.removeTag).toHaveBeenCalledWith("name=description");
            expect(spyMeta.removeTag).toHaveBeenCalledWith(
              "property='og:description'"
            );
            resetSpys();
          })
      );
    });
  });

  function validateHomePageTags(): void {
    expect(spyTitle.setTitle).toHaveBeenCalledWith("Home | Replay Value");
    expect(spyMeta.addTag).toHaveBeenCalledWith({ property: "og:title" });
    expect(spyMeta.updateTag).toHaveBeenCalledWith({
      property: "og:title",
      content: "Home",
    });
    expect(spyMeta.addTag).toHaveBeenCalledWith({
      name: "description",
    });
    expect(spyMeta.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: "This is the home page",
    });
    expect(spyMeta.addTag).toHaveBeenCalledWith({
      property: "og:description",
    });
    expect(spyMeta.updateTag).toHaveBeenCalledWith({
      property: "og:description",
      content: "This is the home page",
    });
    expect(spyMeta.addTag).toHaveBeenCalledWith({
      property: "og:image",
    });
    expect(spyMeta.updateTag).toHaveBeenCalledWith({
      property: "og:image",
      content: imageURL,
    });
    expect(spyMeta.addTag).toHaveBeenCalledWith({
      property: "og:url",
    });
    expect(spyMeta.updateTag).toHaveBeenCalledWith({
      property: "og:url",
      content: "https://getreplayvalue.com/",
    });
    resetSpys();
  }

  function resetSpys(): void {
    spyTitle.setTitle.calls.reset();
    spyMeta.addTag.calls.reset();
    spyMeta.updateTag.calls.reset();
    spyMeta.removeTag.calls.reset();
  }
});
