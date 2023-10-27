{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    pnpm2nix = {
      url = "github:MarcelCoding/pnpm2nix-nzbr";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, pnpm2nix, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          package-production = pkgs.callPackage ./derivation.nix {
            domain = "tlm.solutions";
            mkPnpmPackage = pnpm2nix.packages."${system}".mkPnpmPackage;
          };
          package-staging = pkgs.callPackage ./derivation.nix {
            domain = "staging.tlm.solutions";
            mkPnpmPackage = pnpm2nix.packages."${system}".mkPnpmPackage;
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
