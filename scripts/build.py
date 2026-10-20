#!/usr/bin/env python3
"""
Build store packages for Chromium browsers (Edge, Opera) and Firefox.

    python scripts/build.py

Creates, from the current source tree:

    dist/atilim-moodle-ui-fix-<version>-chromium.zip  Edge Add-ons, Opera Add-ons
    dist/atilim-moodle-ui-fix-<version>-firefox.zip   addons.mozilla.org (AMO)

Both packages contain the same files; only manifest.json differs:

* Chromium keeps the manifest as it is in the repository (MV3 service worker).
* Firefox gets "background.scripts" instead of "background.service_worker"
  (Firefox runs background scripts as an event page and does not support
  extension service workers) and "browser_specific_settings.gecko" with a
  fixed add-on ID and the data-collection declaration that AMO requires for
  new extensions ("none": the extension collects and transmits nothing),
  plus the matching minimum version for Firefox for Android.

Only the Python standard library is used.
"""
import json
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")

# Files and folders that make up the extension at runtime.
INCLUDE = [
    "manifest.json",
    "background.js",
    "content",
    "styles",
    "fonts",
    "icons",
    "popup",
    "guide",
]

FIREFOX_ID = "atilim-moodle-ui-fix@ecerci-atilim.github.io"
FIREFOX_MIN_VERSION = "140.0"  # first release with built-in data consent (data_collection_permissions)
FIREFOX_ANDROID_MIN_VERSION = "142.0"


def collect_files():
    files = []
    for entry in INCLUDE:
        path = os.path.join(ROOT, entry)
        if os.path.isfile(path):
            files.append(entry)
        elif os.path.isdir(path):
            for base, _dirs, names in os.walk(path):
                for name in sorted(names):
                    full = os.path.join(base, name)
                    files.append(os.path.relpath(full, ROOT).replace(os.sep, "/"))
        else:
            sys.exit("missing: " + entry)
    return sorted(set(files))


def firefox_manifest(manifest):
    m = json.loads(json.dumps(manifest))  # deep copy
    background = m.get("background", {})
    worker = background.pop("service_worker", None)
    if worker:
        background["scripts"] = [worker]
    m["background"] = background
    m["browser_specific_settings"] = {
        "gecko": {
            "id": FIREFOX_ID,
            "strict_min_version": FIREFOX_MIN_VERSION,
            "data_collection_permissions": {"required": ["none"]},
        },
        # Firefox for Android only understands data_collection_permissions from 142
        "gecko_android": {"strict_min_version": FIREFOX_ANDROID_MIN_VERSION},
    }
    return m


def write_zip(target, files, manifest):
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
        for rel in files:
            if rel == "manifest.json":
                z.writestr("manifest.json", json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
            else:
                z.write(os.path.join(ROOT, rel), rel)


def main():
    with open(os.path.join(ROOT, "manifest.json"), encoding="utf-8") as f:
        manifest = json.load(f)
    version = manifest["version"]
    files = collect_files()
    os.makedirs(DIST, exist_ok=True)

    chromium_zip = os.path.join(DIST, "atilim-moodle-ui-fix-%s-chromium.zip" % version)
    firefox_zip = os.path.join(DIST, "atilim-moodle-ui-fix-%s-firefox.zip" % version)
    write_zip(chromium_zip, files, manifest)
    write_zip(firefox_zip, files, firefox_manifest(manifest))

    for path in (chromium_zip, firefox_zip):
        print("%-60s %7.1f KB" % (os.path.relpath(path, ROOT), os.path.getsize(path) / 1024))
    print("%d files, version %s" % (len(files), version))


if __name__ == "__main__":
    main()
