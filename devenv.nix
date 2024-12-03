{ pkgs, ... }:
{
  dotenv.disableHint = true;

  languages = {
    javascript.enable = true;
    javascript.bun.enable = true;
    javascript.package = pkgs.nodejs-slim_latest;
    nix.enable = true;
    nix.lsp.package = pkgs.nixd;
    typescript.enable = true;
  };

  packages = [ pkgs.git ];
}
