'use strict';
import I18n from 'react-native-i18n';

I18n.fallbacks = true;
I18n.translations = {
  'en': require('./english'),  
  'hi': require('./hindi'),
  'fr': require('./french'),
  'ja': require('./japanese'),
  'es': require('./spanish'),
};

export default I18n;