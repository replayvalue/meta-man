import { NgModule, ModuleWithProviders } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";
import { MetaManConfig } from "./meta-man.config";
import { META_MAN_CONFIG_TOKEN } from "./meta-man.tokens";

@NgModule({
  providers: [Title, Meta],
})
export class MetaManModule {
  static forRoot(config: MetaManConfig): ModuleWithProviders<MetaManModule> {
    return {
      ngModule: MetaManModule,
      providers: [
        {
          provide: META_MAN_CONFIG_TOKEN,
          useValue: config,
        },
      ],
    };
  }
}
