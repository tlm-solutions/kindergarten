{ lib, stdenv, nodejs, pnpm, domain ? "tlm.solutions" }:

let
  manifest = lib.importJSON ./package.json;
in
stdenv.mkDerivation (finalAttrs: {
  pname = "kindergarten";
  inherit (manifest) version;

  src = lib.cleanSourceWith {
    filter = name: type: ((!lib.hasSuffix ".nix" name) && (builtins.dirOf name) != "node_modules");
    src = lib.cleanSource ./.;
  };

  pnpmDeps = pnpm.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-UIfCiKyTgS8dNDpcXJDtXcULowHHpIV3snUIukuM3Vc=";
  };

  nativeBuildInputs = [ nodejs pnpm.configHook ];

  postPatch = ''
    substituteInPlace src/app/data/api.domain.ts \
      --replace 'staging.tlm.solutions' '${domain}'
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
