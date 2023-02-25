{ pkgs, lib, config, domain, mkYarnPackage, yarn }:
mkYarnPackage {
    name = "kindergarten";
    src = ./.;
    packageJson = ./package.json;
    yarnLock = ./yarn.lock;
    
    buildInputs = [ yarn ];
    postPatch = ''
      substituteInPlace src/app/data/base/data.domain.ts \
        --replace 'staging.dvb.solutions' '${domain}'
    '';

    buildPhase = ''
      cp -r $node_modules ./node_modules
      chmod -R +w ./

      FILE=$(readlink ./deps/kindergarten/node_modules)
      rm ./deps/kindergarten/node_modules
      mkdir ./deps/kindergarten/node_modules
      cp -r $FILE/ ./deps/kindergarten/
      cp -r ./node_modules/leaflet ./deps/kindergarten/node_modules/

      find | grep leaflet.css
      ls deps/kindergarten/

      yarn build
    '';

    installPhase = ''
      mkdir -p $out/bin
      cp -r ./deps/kindergarten/dist/* $out/bin
    '';

    doDist = false;
}
