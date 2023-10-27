{ domain, mkPnpmPackage }:

mkPnpmPackage {
    src = ./.;

    installInPlace = true;

    postPatch = ''
      substituteInPlace src/app/data/api.domain.ts \
        --replace 'staging.tlm.solutions' '${domain}'
    '';

    script = "build:ci";

    installPhase = ''
      mkdir -p $out/en
      mkdir -p $out/de
      cp -r ./dist/en-US/* $out/en/
      cp -r ./dist/de-DE/* $out/de/
    '';
}
