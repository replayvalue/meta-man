# MetaMan

MetaMan is short for _Metadata Manager_, and is a simple library to help keep the header tags in your Angular application in sync with the current route state.

## Installation

```
npm install --save @replayvalue/meta-man
```

## Usage

### Module

The `MetaManModule` must be added to your `AppModule` and configured with the `forRoot` method:

```typescript
import { MetaManModule } from "@replayvalue/meta-man";

@NgModule({
  imports: [
    // In order for MetaMan to work most effectively, paramsInheritance strategy can
    // be set to 'always' for RouterModule. This allows you do reduce title and description
    // duplication for routes that share values.
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: "always" }),
    MetaManModule.forRoot({
      baseTitle: "Replay Value",
      host: "https://getreplayvalue.com",
      includeTwitter: true,
    }),
  ],
})
export class AppModule {}
```

The supported configuration parameters are:

| Property       | Requirement | Description                                                                                                                     |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| baseTitle      | Optional    | An optional fixed portion of the browser title, usually the website name. Will be separated from the `title` by a vertical bar. |
| host           | Optional    | The host used to build canonical urls. Required for `og:image` tags.                                                            |
| includeTwitter | Optional    | Boolean indicating whether or not to include twitter specfic tags.                                                              |

### Component

To listen to route changes and update meta tags, you must called `MetaManService.listenForRouteChanges` in your AppComponent.

```typescript
import { MetaManService } from "@replayvalue/meta-man";

export class AppComponent implements OnInit {
  private _album: Array = [];
  constructor(
    private readonly route: ActivatedRoute,
    private readonly metaManService: MetaManService
  ) {}

  ngOnInit(): void {
    this.metaManService.listenForRouteChanges(this.route);
  }
}
```

## How does it work?

MetaMan will listen to the routing events from the Angular `Router`, and on the `NavigationEnd` event, it
pulls title and metatag properties from the current `ActivatedRouteSnapshot.data`, and updates the title
and metatags of your application. Below is the mapping of `ActivatedRouteSnapshot.data` properties to metatags.

| Property     | MetaTags                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| title        | `<title>`, `<meta property="og:title">`.                                                                                  |
| description  | `<meta name="description">`, `<meta property="og:description">`.                                                          |
| image        | `<meta property="og:image">`, `<meta name="twitter:image">` if `includeTwitter` is `true` and no `twitterImage` property. |
| twitterImage | `<meta name="twitter:image">` if `includeTwitter` is `true`.                                                              |

## License

MIT
