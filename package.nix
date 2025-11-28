{ lib, stdenv, nodejs, pnpm, domain ? "tlm.solutions" }:

let
  manifest = lib.importJSON ./package.json;
in
stdenv.mkDerivation (finalAttrs: {
  pname = manifest.name;
  inherit (manifest) version;

  src = lib.cleanSource ./.;

  pnpmDeps = pnpm.fetchDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 2;
    hash = "sha256-t6i3KIBFNMOEoqF63pLD80uOIXcVFD+vhwA5pH7rS90=";
  };

  nativeBuildInputs = [ nodejs pnpm.configHook ];

  postPatch = ''
    substituteInPlace src/app/data/api.domain.ts \
      --replace 'tlm.solutions' '${domain}'
  '';

  buildPhase = ''
    pnpm run build:ci
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out/en
    mkdir -p $out/de
    cp -r ./dist/browser/en-US/* $out/en/
    cp -r ./dist/browser/de-DE/* $out/de/
    runHook postInstall
  '';
})
