const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

// Force case-sensitivity in path resolution
config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx', 'json'];

module.exports = config;
