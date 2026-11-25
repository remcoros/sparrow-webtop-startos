# Updating Sparrow

1. Update and release [Sparrow Webtop](https://github.com/remcoros/sparrow-webtop) first.
2. Inspect `ghcr.io/remcoros/sparrow-webtop:<version>` with `docker buildx imagetools inspect`. Verify that the release tag and the Webtop release commit tag resolve to the same index digest and that the index contains Linux AMD64 and ARM64.
3. In `startos/versions/current.ts`, set `SPARROW_VERSION` to the upstream Sparrow version and `SPARROW_IMAGE_REF` to the Webtop tag plus its index digest (`ghcr.io/remcoros/sparrow-webtop:<version>@sha256:<digest>`). Update the package version, localized release notes and README image references.
