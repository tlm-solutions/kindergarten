{ lib, stdenv, nodejs, pnpm, domain ? "tlm.solutions" }:

let
  manifest = lib.importJSON ./package.json;
in
stdenv.mkDerivation (finalAttrs: {
  pname = "website";
  inherit (manifest) version;

  src = lib.cleanSource ./.;

  postPatch = ''
    substituteInPlace src/app/data/api.domain.ts \
      --replace 'staging.tlm.solutions' '${domain}'
  '';

  pnpmDeps = pnpm.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-AdTHpm4HPoXbdSpF6QNboqFJchpRoLCvBk8xOpaxWkc=";
  };

  nativeBuildInputs = [ nodejs pnpm.configHook ];

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
