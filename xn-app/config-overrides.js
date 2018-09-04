const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
module.exports = function override(config, env) {
  // 用于修改默认配置。
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
    modifyVars: { "@primary-color": "#1DA57A" },
    })(config, env);
  return config;
};