{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";

    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils, ... }:
    utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          package-production = pkgs.callPackage ./derivation.nix {
            domain = "dvb.solutions";
          };
          package-staging = pkgs.callPackage ./derivation.nix {
            domain = "staging.dvb.solutions";
          };
        in
        rec {
          checks = packages;
          packages = {
            kindergarten = package-production;
            kindergarten-staging = package-staging;
            default = package-production;
          };
        }
      ) // {
      overlays.default = final: prev: {
        inherit (self.packages.${prev.system})
          kindergarten
          kindergarten-staging;
      };
    };
}
