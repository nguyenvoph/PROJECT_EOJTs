import moment from 'moment';

class SimpleReactValidator {
    constructor(options = {}) {
      this.fields = {};
      this.errorMessages = {};
      this.messagesShown = false;
      this.rules = {
        accepted             : {message: ':attribute không hợp lệ.',                                          rule: val => val === true, required: true},
        after                : {message: ':attribute phải sau :date.',                                        rule: (val, params) => this.helpers.momentInstalled() && moment.isMoment(val) && val.isAfter(params[0], 'day'), messageReplace: (message, params) => message.replace(':date', params[0].format('MM/DD/YYYY'))},
        after_or_equal       : {message: ':attribute phải sau hoặc trùng :date.',                             rule: (val, params) => this.helpers.momentInstalled() && moment.isMoment(val) && val.isSameOrAfter(params[0], 'day'), messageReplace: (message, params) => message.replace(':date', params[0].format('MM/DD/YYYY'))},
        alpha                : {message: ':attribute chỉ có thể chứa các kí tự.',                             rule: val => this.helpers.testRegex(val,/^[A-Z]*$/i)},
        alpha_space          : {message: ':attribute chỉ có thể chứa các kí tự và khoảng trắng.',             rule: val => this.helpers.testRegex(val,/^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/i)},
        alpha_num            : {message: ':attribute chỉ có thể chứa các kí tự và số.',                       rule: val => this.helpers.testRegex(val,/^[A-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/i)},
        alpha_num_space      : {message: ':attribute chỉ được chứa kí tự, số và khoảng trắng.',               rule: val => this.helpers.testRegex(val,/^[A-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/i)},
        alpha_num_dot_splash : {message: ':attribute chỉ được chứa kí tự, số, chấm và khoảng trắng.',         rule: val => this.helpers.testRegex(val,/^[A-Z0-9.,/ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/i)},
        alpha_num_dash       : {message: ':attribute may only contain letters, numbers, and dashes.',         rule: val => this.helpers.testRegex(val,/^[A-Z0-9_-]*$/i)},
        alpha_num_dash_space : {message: ':attribute may only contain letters, numbers, dashes, and spaces.', rule: val => this.helpers.testRegex(val,/^[A-Z0-9_-\s]*$/i)},
        array                : {message: ':attribute must be an array.',                                      rule: val => Array.isArray(val)},
        before               : {message: ':attribute must be before :date.',                                  rule: (val, params) => this.helpers.momentInstalled() && moment.isMoment(val) && val.isBefore(params[0], 'day'), messageReplace: (message, params) => message.replace(':date', params[0].format('MM/DD/YYYY'))},
        before_or_equal      : {message: ':attribute must be before or on :date.',                            rule: (val, params) => this.helpers.momentInstalled() && moment.isMoment(val) && val.isSameOrBefore(params[0], 'day'), messageReplace: (message, params) => message.replace(':date', params[0].format('MM/DD/YYYY'))},
        between              : {message: ':attribute must be between :min and :max:type.',                    rule: (val, params) => this.helpers.size(val, params[2]) >= parseFloat(params[0]) && this.helpers.size(val, params[2]) <= parseFloat(params[1]), messageReplace: (message, params) => message.replace(':min', params[0]).replace(':max', params[1]).replace(':type', this.helpers.sizeText(params[2]))},
        boolean              : {message: ':attribute must be a boolean.',                                     rule: val => val === false || val === true},
        card_exp             : {message: ':attribute must be a valid expiration date.',                       rule: val => this.helpers.testRegex(val,/^(([0]?[1-9]{1})|([1]{1}[0-2]{1}))\s?\/\s?(\d{2}|\d{4})$/)},
        card_num             : {message: ':attribute must be a valid credit card number.',                    rule: val => this.helpers.testRegex(val,/^\d{4}\s?\d{4,6}\s?\d{4,5}\s?\d{0,8}$/)},
        currency             : {message: ':attribute must be a valid currency.',                              rule: val => this.helpers.testRegex(val,/^\$?(\d{1,3})(\,?\d{3})*\.?\d{0,2}$/)},
        date                 : {message: ':attribute must be a date.',                                        rule: val => this.helpers.momentInstalled() && moment.isMoment(val)},
        date_equals          : {message: ':attribute must be on :date.',                                      rule: (val, params) => this.helpers.momentInstalled() && moment.isMoment(val) && val.isSame(params[0], 'day'), messageReplace: (message, params) => message.replace(':date', params[0].format('MM/DD/YYYY'))},
        email                : {message: ':attribute không hợp lệ.',                                          rule: val => this.helpers.testRegex(val,/^[A-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)},
        in                   : {message: 'selected :attribute must be :values.',                              rule: (val, params) => params.indexOf(val) > -1, messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params))},
        integer              : {message: ':attribute không hợp lệ.',                                          rule: val => this.helpers.testRegex(val,/^\d*$/)},
        max                  : {message: ':attribute không thể có nhiều hơn :max:type.',                      rule: (val, params) => this.helpers.size(val, params[1]) <= parseFloat(params[0]), messageReplace: (message, params) => message.replace(':max', params[0]).replace(':type', this.helpers.sizeText(params[1]))},
        min                  : {message: ':attribute phải có ít nhất :min:type.',                             rule: (val, params) => this.helpers.size(val, params[1]) >= parseFloat(params[0]), messageReplace: (message, params) => message.replace(':min', params[0]).replace(':type', this.helpers.sizeText(params[1]))},
        not_in               : {message: 'selected :attribute must not be :values.',                          rule: (val, params) => params.indexOf(val) === -1, messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params))},
        not_regex            : {message: ':attribute must not match required pattern.',                       rule: (val, params) => !this.helpers.testRegex(val, typeof params[0] === 'string' || params[0] instanceof String ? new RegExp(params[0]) : params[0])},
        numeric              : {message: ':attribute must be a number.',                                      rule: val => this.helpers.numeric(val)},
        phone                : {message: ':attribute must be a valid phone number.',                          rule: val => this.helpers.testRegex(val,/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/)},
        regex                : {message: ':attribute must match required pattern.',                           rule: (val, params) => this.helpers.testRegex(val, typeof params[0] === 'string' || params[0] instanceof String ? new RegExp(params[0]) : params[0])},
        required             : {message: ':attribute không hợp lệ.',                                          rule: val => !this.helpers.isBlank(val), required: true },
        size                 : {message: ':attribute không hợp lệ.',                                          rule: (val, params) => this.helpers.size(val, params[1]) > parseFloat(params[0]), messageReplace: (message, params) => message.replace(':size', params[0]).replace(':type', this.helpers.sizeText(params[1]))},
        string               : {message: ':attribute must be a string.',                                      rule: val => typeof(val) === typeof('string')},
        typeof               : {message: ':attribute is not correct type of :type.',                          rule: (val, params) => typeof(val) === typeof(params[0]), messageReplace: (message, params) => message.replace(':type', typeof(params[0]))},
        url                  : {message: ':attribute must be a url.',                                         rule: val => this.helpers.testRegex(val,/^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i)},
        ...(options.validators || {}),
      };
  
      this.messages = options.messages || {};
      this.className = options.className;
  
      if (options.element === false) {
        this.element = message => message;
      } else if (options.hasOwnProperty('element')) {
        this.element = options.element;
      } else if (typeof navigator === 'object' && navigator.product === 'ReactNative') {
        this.element = message => message;
      } else {
        // this.element = (message, className) => React.createElement('div', {className: (className || this.className || 'srv-validation-message')}, message);
      }
    }
  
    getErrorMessages() {
      return this.errorMessages;
    }
  
    showMessages() {
      this.messagesShown = true;
    }
  
    hideMessages() {
      this.messagesShown = false;
    }
  
    allValid() {
      for (let key in this.fields) {
        if (this.fieldValid(key) === false) {
          return false;
        }
      }
      return true;
    }
  
    fieldValid(field) {
      return this.fields.hasOwnProperty(field) && this.fields[field] === true;
    }
  
    purgeFields() {
      this.fields = {};
      this.errorMessages = {};
    }
  
    messageWhenPresent(message, options = {}) {
      if (!this.helpers.isBlank(message) && this.messagesShown) {
        return this.helpers.element(message, options);
      }
    }
  
    messageAlways(field, message, options = {}) {
      if (message && this.messagesShown) {
        return this.helpers.element(message, options);
      }
    }
  
    message(field, inputValue, validations, options = {}) {
      this.errorMessages[field] = null;
      this.fields[field] = true;
      if (!Array.isArray(validations)) {
        validations = validations.split('|');
      }
      var rules = options.validators ? {...this.rules, ...options.validators} : this.rules;
      for (let validation of validations) {
        let [value, rule, params] = this.helpers.normalizeValues(inputValue, validation);
        if (!this.helpers.passes(rule, value, params, rules)) {
          this.fields[field] = false;
          let message = this.helpers.message(rule, field, options, rules);
  
          if (params.length > 0 && rules[rule].hasOwnProperty('messageReplace')) {
            message = rules[rule].messageReplace(message, params);
          }
  
          this.errorMessages[field] = message;
          if (this.messagesShown) {
            return this.helpers.element(message, options);
          }
        }
      }
    }
  
    helpers = {
      parent: this,
  
      passes(rule, value, params, rules) {
        if (!rules.hasOwnProperty(rule)) {
          console.error(`Rule Not Found: There is no rule with the name ${rule}.`);
          return true;
        }
        if (!this.isRequired(rule, rules) && this.isBlank(value)) {
          return true;
        }
        return rules[rule].rule(value, params, this.parent) !== false;
      },
  
      isRequired(rule, rules) {
        return rules[rule].hasOwnProperty('required') && rules[rule].required;
      },
  
      isBlank(value) {
        return typeof(value) === 'undefined' || value === null || value === '';
      },
  
      normalizeValues(value, validation) {
        return [this.valueOrEmptyString(value), this.getValidation(validation), this.getOptions(validation)];
      },
  
      getValidation(validation) {
        if (validation === Object(validation) && !!Object.keys(validation).length) {
          return Object.keys(validation)[0];
        } else {
          return validation.split(':')[0];
        }
      },
  
      getOptions(validation) {
        if (validation === Object(validation) && !!Object.values(validation).length) {
          var params = Object.values(validation)[0];
          return Array.isArray(params) ? params : [params];
        } else {
          var params = validation.split(':');
          return params.length > 1 ? params[1].split(',') : [];
        }
      },
  
      valueOrEmptyString(value) {
        return typeof value === 'undefined' || value === null ? '' : value;
      },
  
      toSentence(arr) {
        return arr.slice(0, -2).join(', ') +
        (arr.slice(0, -2).length ? ', ' : '') +
        arr.slice(-2).join(arr.length > 2 ? ', or ' : ' or ');
      },
  
      testRegex(value, regex) {
        return value.toString().match(regex) !== null;
      },
  
      message(rule, field, options, rules) {
        options.messages = options.messages || {};
        var message = options.messages[rule] || options.messages.default || this.parent.messages[rule] || this.parent.messages.default || rules[rule].message;
        return message.replace(':attribute', field);
      },
  
      humanizeFieldName(field) {
        return field.replace( /([A-Z])/g, ' $1' ).replace(/_/g, ' ').toLowerCase();
      },
  
      element(message, options) {
        // var element = options.element || this.parent.element;
        return message;
      },
  
      numeric(val) {
        return this.testRegex(val,/^(\d+.?\d*)?$/);
      },
  
      momentInstalled() {
        if (!window || !window.moment) {
          return false;
        } else {
          return true;
        }
      },
  
      size(val, type) {
        if (type === 'string' || type === undefined || type === 'array') {
          return val.length;
        } else if (type === 'num') {
          return parseFloat(val);
        }
      },
  
      sizeText(type) {
        if (type === 'string' || type === undefined) {
          return ' kí tự';
        } else if (type === 'array') {
          return ' elements';
        } else {
          return '';
        }
      }
    }
  }

  export default SimpleReactValidator;
  