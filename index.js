/*!
 * Form module.
 *
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
import angular from 'angular';
import DatepickerDirective from './datepicker-directive.js';
import DateFormatDirective from './date-format-directive.js';
import FormDirective from './form-directive.js';
import FormControlComponent from './form-control-component.js';
import FormFieldDirective from './form-field-directive.js';
import FormGroupDirective from './form-group-directive.js';
import FormLibraryService from './form-library-service.js';
import FormStaticDirective from './form-static-directive.js';
import FormUtilsService from './form-utils-service.js';
import HelpToggleDirective from './help-toggle-directive.js';
import InputDirective from './input-directive.js';
import InputManipulatorDirective from './input-manipulator-directive.js';
import InputWatcherDirective from './input-watcher-directive.js';
import RadioGroupDirective from './radio-group-directive.js';
import SelectComponent from './select-component.js';
import TextareaDirective from './textarea-directive.js';
import TrackStateDirective from './track-state-directive.js';
import ValidatorSameAsDirective from './validator-same-as-directive.js';

// TODO: how to make `ngMaterial` optional?
var module = angular.module(
  'bedrock.form', [
    'bedrock.alert', 'bedrock.lazyCompile', 'bedrock.resource', 'ngMaterial',
    'ngSanitize'
  ]);

module.component('brFormControl', FormControlComponent);
module.component('brSelect', SelectComponent);
module.directive('brInput', InputDirective);
module.directive('brInputManipulator', InputManipulatorDirective);
module.directive('brDatepicker', DatepickerDirective);
module.directive('brDateFormat', DateFormatDirective);
module.directive('brForm', FormDirective);
module.directive('brFormField', FormFieldDirective);
module.directive('brFormGroup', FormGroupDirective);
module.directive('brFormStatic', FormStaticDirective);
module.directive('brHelpToggle', HelpToggleDirective);
module.directive('brInputWatcher', InputWatcherDirective);
module.directive('brRadioGroup', RadioGroupDirective);
module.directive('brTextarea', TextareaDirective);
module.directive('brTrackState', TrackStateDirective);
module.directive('brValidatorSameAs', ValidatorSameAsDirective);
module.service('brFormLibraryService', FormLibraryService);
module.service('brFormUtilsService', FormUtilsService);

module.run(function(config) {
  var constants = config.constants = config.constants || {};

  constants.monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  constants.monthNumbers = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
    '12'
  ];

  // country map sorted by display order
  constants.countries = [
    {code: 'AH', name: 'Afghanistan'},
    {code: 'AL', name: 'Albania'},
    {code: 'DZ', name: 'Algeria'},
    {code: 'AD', name: 'Andorra'},
    {code: 'AO', name: 'Angola'},
    {code: 'AI', name: 'Anguilla'},
    {code: 'AQ', name: 'Antarctica'},
    {code: 'AG', name: 'Antigua'},
    {code: 'AM', name: 'Armenia'},
    {code: 'AR', name: 'Argentina'},
    {code: 'AW', name: 'Aruba'},
    {code: 'AU', name: 'Australia'},
    {code: 'AT', name: 'Austria'},
    {code: 'AZ', name: 'Azerbaidjan'},
    {code: 'BS', name: 'Bahamas'},
    {code: 'BH', name: 'Bahrain'},
    {code: 'BD', name: 'Bangladesh'},
    {code: 'BB', name: 'Barbados'},
    {code: 'BY', name: 'Belarus'},
    {code: 'BE', name: 'Belgium'},
    {code: 'BZ', name: 'Belize'},
    {code: 'BJ', name: 'Benin'},
    {code: 'BM', name: 'Bermuda'},
    {code: 'BT', name: 'Bhutan'},
    {code: 'BA', name: 'Bosnia-Herzegovina'},
    {code: 'BO', name: 'Bolivia'},
    {code: 'BW', name: 'Botswana'},
    {code: 'BV', name: 'Bouvet Island'},
    {code: 'BR', name: 'Brazil'},
    {code: 'BN', name: 'Brunei Darussalam'},
    {code: 'BG', name: 'Bulgaria'},
    {code: 'BF', name: 'Burkina Faso'},
    {code: 'BI', name: 'Burundi'},
    {code: 'KH', name: 'Cambodia'},
    {code: 'CM', name: 'Cameroon'},
    {code: 'CA', name: 'Canada'},
    {code: 'CV', name: 'Cape Verde'},
    {code: 'KY', name: 'Cayman Islands'},
    {code: 'CF', name: 'Central African Republic'},
    {code: 'TD', name: 'Chad'},
    {code: 'CL', name: 'Chile'},
    {code: 'CN', name: 'China'},
    {code: 'CX', name: 'Christmas Island'},
    {code: 'HR', name: 'Croatia'},
    {code: 'CC', name: 'Cocos Islands'},
    {code: 'CO', name: 'Colombia'},
    {code: 'KM', name: 'Comoros'},
    {code: 'CG', name: 'Congo'},
    {code: 'CD', name: 'Congo, Democratic Republic'},
    {code: 'CK', name: 'Cook Islands'},
    {code: 'CR', name: 'Costa Rica'},
    {code: 'CU', name: 'Cuba'},
    {code: 'CY', name: 'Cyprus'},
    {code: 'CZ', name: 'Czech Republic'},
    {code: 'DJ', name: 'Djibouti'},
    {code: 'DK', name: 'Denmark'},
    {code: 'DM', name: 'Dominica'},
    {code: 'DO', name: 'Dominican Republic'},
    {code: 'TP', name: 'East Timor'},
    {code: 'EC', name: 'Ecuador'},
    {code: 'FG', name: 'Egypt'},
    {code: 'SV', name: 'El Salvador'},
    {code: 'ER', name: 'Eritrea'},
    {code: 'EE', name: 'Estonia'},
    {code: 'ET', name: 'Ethiopia'},
    {code: 'GQ', name: 'Equatorial Guinea'},
    {code: 'FK', name: 'Falkland Islands'},
    {code: 'FJ', name: 'Fiji'},
    {code: 'FI', name: 'Finland'},
    {code: 'GF', name: 'French Guyana'},
    {code: 'FO', name: 'Faroe Islands'},
    {code: 'FR', name: 'France'},
    {code: 'GA', name: 'Gabon'},
    {code: 'GM', name: 'Gambia'},
    {code: 'GE', name: 'Georgia'},
    {code: 'DE', name: 'Germany'},
    {code: 'GH', name: 'Ghana'},
    {code: 'GI', name: 'Gibraltar'},
    {code: 'GR', name: 'Greece'},
    {code: 'GL', name: 'Greenland'},
    {code: 'GD', name: 'Grenada'},
    {code: 'GP', name: 'Guadeloupe'},
    {code: 'GU', name: 'Guam'},
    {code: 'GT', name: 'Guatemala'},
    {code: 'GN', name: 'Guinea'},
    {code: 'GW', name: 'Guinea Bissau'},
    {code: 'GY', name: 'Guyana'},
    {code: 'HT', name: 'Haiti'},
    {code: 'HM', name: 'Heard and McDonald Islands'},
    {code: 'HN', name: 'Honduras'},
    {code: 'HK', name: 'Hong Kong'},
    {code: 'HU', name: 'Hungary'},
    {code: 'IS', name: 'Iceland'},
    {code: 'IN', name: 'India'},
    {code: 'ID', name: 'Indonesia'},
    {code: 'IQ', name: 'Iraq'},
    {code: 'IR', name: 'Iran'},
    {code: 'IE', name: 'Ireland'},
    {code: 'IL', name: 'Israel'},
    {code: 'IT', name: 'Italy'},
    {code: 'CI', name: 'Ivory Coast'},
    {code: 'JM', name: 'Jamaica'},
    {code: 'JP', name: 'Japan'},
    {code: 'JO', name: 'Jordan'},
    {code: 'KE', name: 'Kenya'},
    {code: 'KI', name: 'Kiribati'},
    {code: 'KG', name: 'Kyrgyz Republic (Kyrgyzstan)'},
    {code: 'KW', name: 'Kuwait'},
    {code: 'KZ', name: 'Kazakhstan'},
    {code: 'LA', name: 'Laos'},
    {code: 'LV', name: 'Latvia'},
    {code: 'LB', name: 'Lebanon'},
    {code: 'LS', name: 'Lesotho'},
    {code: 'LR', name: 'Liberia'},
    {code: 'LI', name: 'Liechtenstein'},
    {code: 'LT', name: 'Lithuania'},
    {code: 'LY', name: 'Libya'},
    {code: 'LU', name: 'Luxembourg'},
    {code: 'MO', name: 'Macau'},
    {code: 'MK', name: 'Macedonia'},
    {code: 'MG', name: 'Madagascar'},
    {code: 'ML', name: 'Mali'},
    {code: 'MT', name: 'Malta'},
    {code: 'MV', name: 'Maldives'},
    {code: 'MW', name: 'Malawi'},
    {code: 'MY', name: 'Malaysia'},
    {code: 'MH', name: 'Marshall Islands'},
    {code: 'MQ', name: 'Martinique'},
    {code: 'MR', name: 'Mauritania'},
    {code: 'MU', name: 'Mauritius'},
    {code: 'YT', name: 'Mayotte'},
    {code: 'MX', name: 'Mexico'},
    {code: 'FM', name: 'Micronesia'},
    {code: 'MD', name: 'Moldavia'},
    {code: 'MC', name: 'Monaco'},
    {code: 'MN', name: 'Mongolia'},
    {code: 'MS', name: 'Montserrat'},
    {code: 'MA', name: 'Morocco'},
    {code: 'MZ', name: 'Mozambique'},
    {code: 'MM', name: 'Myanmar'},
    {code: 'NA', name: 'Namibia'},
    {code: 'NR', name: 'Nauru'},
    {code: 'NP', name: 'Nepal'},
    {code: 'NL', name: 'Netherlands'},
    {code: 'NC', name: 'New Caledonia'},
    {code: 'NZ', name: 'New Zealand'},
    {code: 'NE', name: 'Niger'},
    {code: 'NG', name: 'Nigeria'},
    {code: 'NI', name: 'Nicaragua'},
    {code: 'NU', name: 'Niue'},
    {code: 'NF', name: 'Norfolk Island'},
    {code: 'KP', name: 'North Korea'},
    {code: 'MP', name: 'Northern Mariana Islands'},
    {code: 'NO', name: 'Norway'},
    {code: 'OM', name: 'Oman'},
    {code: 'PW', name: 'Palau'},
    {code: 'PK', name: 'Pakistan'},
    {code: 'PA', name: 'Panama'},
    {code: 'PG', name: 'Papua New Guinea'},
    {code: 'PY', name: 'Paraguay'},
    {code: 'PE', name: 'Peru'},
    {code: 'PH', name: 'Philippines'},
    {code: 'PN', name: 'Pitcairn Island'},
    {code: 'PR', name: 'Puerto Rico'},
    {code: 'PL', name: 'Poland'},
    {code: 'PF', name: 'Polynesia'},
    {code: 'PT', name: 'Portugal'},
    {code: 'QA', name: 'Qatar'},
    {code: 'RE', name: 'Reunion'},
    {code: 'RO', name: 'Romania'},
    {code: 'RU', name: 'Russia'},
    {code: 'RW', name: 'Rwanda'},
    {code: 'SH', name: 'Saint Helena'},
    {code: 'KN', name: 'Saint Kitts and Nevis Anguilla'},
    {code: 'LC', name: 'Saint Lucia'},
    {code: 'PM', name: 'Saint Pierre and Miquelon'},
    {code: 'ST', name: 'Saint Tome and Principe'},
    {code: 'WS', name: 'Samoa'},
    {code: 'SM', name: 'San Marino'},
    {code: 'SA', name: 'Saudi Arabia'},
    {code: 'SN', name: 'Senegal'},
    {code: 'SC', name: 'Seychelles'},
    {code: 'SL', name: 'Sierra Leone'},
    {code: 'SG', name: 'Singapore'},
    {code: 'SK', name: 'Slovak Republic'},
    {code: 'SI', name: 'Slovenia'},
    {code: 'SB', name: 'Solomon Islands'},
    {code: 'SO', name: 'Somalia'},
    {code: 'ZA', name: 'South Africa'},
    {code: 'GS', name: 'S. Georgia and S. Sandwich Isls.'},
    {code: 'KR', name: 'South Korea'},
    {code: 'ES', name: 'Spain'},
    {code: 'LK', name: 'Sri Lanka'},
    {code: 'SD', name: 'Sudan'},
    {code: 'SS', name: 'South Sudan'},
    {code: 'SR', name: 'Suriname'},
    {code: 'SJ', name: 'Svalbard and Jan Mayen Islands'},
    {code: 'SZ', name: 'Swaziland'},
    {code: 'SE', name: 'Sweden'},
    {code: 'CH', name: 'Switzerland'},
    {code: 'SY', name: 'Syria'},
    {code: 'TJ', name: 'Tadjikistan'},
    {code: 'TW', name: 'Taiwan'},
    {code: 'TZ', name: 'Tanzania'},
    {code: 'TG', name: 'Togo'},
    {code: 'TK', name: 'Tokelau'},
    {code: 'TO', name: 'Tonga'},
    {code: 'TH', name: 'Thailand'},
    {code: 'TN', name: 'Tunisia'},
    {code: 'TR', name: 'Turkey'},
    {code: 'TM', name: 'Turkmenistan'},
    {code: 'TC', name: 'Turks and Caicos Islands'},
    {code: 'TT', name: 'Trinidad and Tobago'},
    {code: 'TV', name: 'Tuvalu'},
    {code: 'UA', name: 'Ukraine'},
    {code: 'UG', name: 'Uganda'},
    {code: 'AE', name: 'United Arab Emirates'},
    {code: 'UK', name: 'United Kingdom'},
    {code: 'US', name: 'United States'},
    {code: 'UY', name: 'Uruguay'},
    {code: 'UZ', name: 'Uzbekistan'},
    {code: 'VA', name: 'Vatican City'},
    {code: 'VC', name: 'Saint Vincent and Grenadines'},
    {code: 'VU', name: 'Vanuatu'},
    {code: 'VE', name: 'Venezuela'},
    {code: 'VG', name: 'Virgin Islands (British)'},
    {code: 'VI', name: 'Virgin Islands (USA)'},
    {code: 'VN', name: 'Vietnam'},
    {code: 'WF', name: 'Wallis and Futuna Islands'},
    {code: 'EH', name: 'Western Sahara'},
    {code: 'YE', name: 'Yemen'},
    {code: 'YU', name: 'Yugoslavia'},
    {code: 'ZR', name: 'Zaire'},
    {code: 'ZM', name: 'Zambia'},
    {code: 'ZW', name: 'Zimbabwe'}
  ];

  // create {index: #, label: "01 - January"} labels
  constants.monthLabels = [];
  for(var i = 0; i < 12; ++i) {
    constants.monthLabels[i] = {
      index: i + 1,
      label: constants.monthNumbers[i] + ' - ' + constants.monthNames[i]
    };
  }

  // next ten 10 years for expiration dates (quick hack)
  constants.years = [];
  var year = new Date().getFullYear();
  for(var i = 0; i < 10; ++i) {
    constants.years.push(year + i);
  }
});
