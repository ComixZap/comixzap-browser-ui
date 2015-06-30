cwd="$(pwd)"

#pushd "$(dirname $0)" > /dev/null
#scriptdir="$(pwd)"
#popd > /dev/null

scriptdir="$cwd"

rootdir="$cwd"
browserdir="$(mktemp -d /tmp/XXXXXXXXXX)"

git clone "https://github.com/ComixZap/comixzap-browser-ui" "$browserdir"

cd "$browserdir"
npm install
echo '{}' > config.json
./node_modules/.bin/gulp build

mkdir -p "$rootdir/public"
cp -r dist/* dist/.* "$rootdir/public"

cd "$cwd"
