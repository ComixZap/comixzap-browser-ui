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
cp dist/index.html "$rootdir/public"
cp -r dist/css "$rootdir/public"
cp -r dist/js "$rootdir/public"

cd "$cwd"
