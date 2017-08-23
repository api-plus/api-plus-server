/*
  参考：https://ant.design/components/icon-cn/

  由于 ant design 的 iconfont 会依赖 https://at.alicdn.com/ 的字体资源，
  而万达内网不能访问外部资源，所以需要将字体打包到自己的应用里。

  利用 less-loader 的 modifyVars 属性，修改 antd 里的 @icon-url 变量。详见 webpack.config.js
*/

import '../../../assets/iconfont/iconfont.eot';
import '../../../assets/iconfont/iconfont.svg';
import '../../../assets/iconfont/iconfont.ttf';
import '../../../assets/iconfont/iconfont.woff';