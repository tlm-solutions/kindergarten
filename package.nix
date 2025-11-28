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
    hash = "sha256-p/84qht5m0EF5JgUsmMxb33gnIB9rKf/IrsTobE1ahE=";
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
