import { Injectable, Inject } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, Event } from "@angular/router";
import { Title, Meta, MetaDefinition } from "@angular/platform-browser";
import { MetaManModule } from "./meta-man.module";
import { META_MAN_CONFIG_TOKEN } from "./meta-man.tokens";
import { MetaManConfig } from "./meta-man.config";
import { Observable, identity, NextObserver } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { MetaData } from "./meta-data.model";

@Injectable({
  providedIn: MetaManModule,
})
export class MetaManService {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly router: Router,
    @Inject(META_MAN_CONFIG_TOKEN)
    private readonly config: MetaManConfig
  ) {}

  /**
   * Listens for NavigationEnd events from the application Router, and
   * updates <head> metadata based on the passed in route.
   * @param route ActivatedRoute to traverse to resolve header metadata.
   * @param onDestroy$ Underlying subscription will listen until this emits.
   * This param is optional, but subscription will listen indefinitely if not
   * provided.
   */
  listenForRouteChange(
    route: ActivatedRoute,
    onDestroy$?: Observable<void>
  ): void {
    this.router.events
      .pipe(
        onDestroy$ ? takeUntil(onDestroy$) : identity,
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(this.routeEventObserver(route));
  }

  setMetaTags({ title, description, image, twitterImage }: MetaData): void {
    this.handleTitle(title);
    this.handleDescription(description);
    this.handleImage(image);
    if (this.config.includeTwitter) {
      this.handleTwitter(image, twitterImage);
    }
    if (this.config.host) {
      const host = this.config.host;
      this.setTag(
        {
          property: "og:url",
        },
        `${host}${this.router.routerState.snapshot.url}`
      );
    }
  }

  private handleTitle(title: string | null | undefined): void {
    if (title) {
      const baseTitle = this.config.baseTitle;
      this.title.setTitle(
        `${title}${baseTitle ? " | " : ""}${baseTitle ?? ""}`
      );
      this.setTag({ property: "og:title" }, title);
    } else if (title === null) {
      this.meta.removeTag("property=og:title");
    }
  }

  private handleDescription(description: string | null | undefined): void {
    if (description) {
      this.setTag({ name: "description" }, description);
      this.setTag({ property: "og:description" }, description);
    } else if (description === null) {
      this.meta.removeTag("name=description");
      this.meta.removeTag("property=og:description");
    }
  }

  private handleImage(image: string | null | undefined): void {
    if (image) {
      this.setTag({ property: "og:image" }, image);
    } else if (image === null) {
      this.meta.removeTag("property=og:image");
    }
  }

  private handleTwitter(
    image: string | null | undefined,
    twitterImage: string | null | undefined
  ): void {
    const imageToUse = twitterImage ?? image;
    if (imageToUse) {
      this.setTag({ name: "twitter:image" }, imageToUse);
    } else {
      this.meta.removeTag("name=twitter:image");
    }
  }

  /**
   * Ensures tag exists and updates with appropriate value.
   */
  private setTag(tag: MetaDefinition, content: string): void {
    const { name, property } = tag;
    this.meta.addTag(tag);
    this.meta.updateTag({
      ...(name && { name }),
      ...(property && { property }),
      content,
    });
  }

  private resolveMetadata(route: ActivatedRoute): MetaData {
    let current = route;
    let next = current.firstChild;
    while (next) {
      current = next;
      next = current.firstChild;
    }
    return current.snapshot.data;
  }

  private routeEventObserver(route: ActivatedRoute): NextObserver<Event> {
    return {
      next: () => {
        this.setMetaTags(this.resolveMetadata(route));
      },
    };
  }
}
