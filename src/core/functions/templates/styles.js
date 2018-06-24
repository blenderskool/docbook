import path from 'path';
import bundler from '../../utils/bundler';
import loader from '../plugins/loader';
import cleanCSS from "clean-css";

export default function() {
  /**
   * Bundle the default, external css files into one single file
   */
  const config = require(__base+'/docbook.config');
  const external = Array.isArray(config.styles) ? config.styles : [];
  
  let pluginCSS = '';
  if (config.plugins && typeof config.plugins === "object") {
    for (let tag in config.plugins) {
      pluginCSS += loader(`${__base}/${config.plugins[tag]}`, null, 'css');
    }
  }

  return new cleanCSS({}).minify(bundler([
    path.join(__dirname, '../../templates/css/reset.min.css'),
    path.join(__dirname, '../../templates/css/styles.css')
  ].concat(external), err => {
    console.log(err);
  }) + pluginCSS).styles;
}