#!/usr/bin/env bash
# Renders the branded wire-instruction PDFs from the HTML sources.
#
# Requires WeasyPrint (pip install weasyprint) and network access for the
# Orbitron/Inter web fonts used in the Canada BTC Miners wordmark.
#
# Usage: bash build/build.sh
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"

weasyprint "$here/build/canadian.html" "$here/Canadian Wire Instructions.pdf"
weasyprint "$here/build/us.html"       "$here/US Wire Instructions.pdf"

echo "Rendered:"
echo "  $here/Canadian Wire Instructions.pdf"
echo "  $here/US Wire Instructions.pdf"
