{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = (import nixpkgs) {
            inherit system;
          };
        in
        {
          packages = rec {
            kindergarten = pkgs.callPackage ./package.nix { };
            default = kindergarten;
          };
        }
      ) // {
      overlays.default = _: prev: {
        inherit (self.packages.${prev.system}) kindergarten;
      };
    };
}
