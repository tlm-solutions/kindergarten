{ pkgs, lib, config, domain, mkYarnPackage, yarn }:
mkYarnPackage {
    name = "kindergarten";
    src = ./.;

    buildInputs = [ yarn ];
    postPatch = ''
      substituteInPlace src/app/data/api.domain.ts \
        --replace 'staging.tlm.solutions' '${domain}'
    '';

    buildPhase = ''
      FILE=$(readlink ./deps/kindergarten/node_modules)
      rm ./deps/kindergarten/node_modules
      mkdir ./deps/kindergarten/node_modules
      cp -r $FILE/ ./deps/kindergarten/
      cp -r ./node_modules/* ./deps/kindergarten/node_modules/

      yarn run build:ci
    '';

    installPhase = ''
      mkdir -p $out/bin/en
      mkdir -p $out/bin/de
      cp -r ./deps/kindergarten/dist/en-US/* $out/bin/en/
      cp -r ./deps/kindergarten/dist/de-DE/* $out/bin/de/
    '';

    doDist = false;
}
