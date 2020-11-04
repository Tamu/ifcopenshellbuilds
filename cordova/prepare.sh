echo "
Enter your Aurelia Project Folder Name:"
read AURELIA_FOLDER_NAME

echo "
Enter your Cordova Folder Name:"
read FOLDER_NAME

echo "
Enter your Cordova reverse domain value:"
read DOMAIN_NAME

echo "
Enter your Cordova App Name:"
read APP_NAME

cd ../
au cordova --env prod
cd ../
rm -rf "$PROJECT_NAME"
cordova create "$FOLDER_NAME" "$DOMAIN_NAME" "$APP_NAME"
cd "$FOLDER_NAME"
rm -rf www
rm config.xml
ln -s "../$AURELIA_FOLDER_NAME/cordova/config.xml" config.xml
ln -s "../$AURELIA_FOLDER_NAME/cordova/www" www
cordova platform add browser
cordova platform add ios
# https://github.com/apache/cordova-ios/issues/661#issuecomment-528848433
# if neeeded to add a FORK version of the iOS platform
cp "../$AURELIA_FOLDER_NAME/cordova/build-icons.sh" build-icons.sh
cp "../$AURELIA_FOLDER_NAME/cordova/runios.sh" runios.sh
cp "../$AURELIA_FOLDER_NAME/cordova/runbrowser.sh" runbrowser.sh
sh build-icons.sh
cordova run browser

# Create a build file build.sh
rm build.sh
echo "cd ../
au cordova --env prod
cd ../
cd \"$FOLDER_NAME\"
sh runios.sh
" > build.sh