{ pkgs, lib, config, domain, mkYarnPackage, yarn }:
mkYarnPackage {
    name = "kindergarten";
    src = ./.;

    buildInputs = [ yarn ];
    postPatch = ''
      substituteInPlace src/app/data/base/data.domain.ts \
        --replace 'staging.dvb.solutions' '${domain}'
    '';

    buildPhase = ''
      FILE=$(readlink ./deps/kindergarten/node_modules)
      rm ./deps/kindergarten/node_modules
      mkdir ./deps/kindergarten/node_modules
      cp -r $FILE/ ./deps/kindergarten/
      cp -r ./node_modules/* ./deps/kindergarten/node_modules/

      ls ./deps/kindergarten/node_modules/

      yarn build
    '';

    installPhase = ''
      mkdir -p $out/bin
      cp -r ./deps/kindergarten/dist/* $out/bin
    '';

    doDist = false;
}
