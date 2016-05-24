'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _conceptualImagePicker = require('text!./conceptual-image-picker.html');

var _conceptualImagePicker2 = _interopRequireDefault(_conceptualImagePicker);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

var _urlUtilities = require('url-utilities');

var _urlUtilities2 = _interopRequireDefault(_urlUtilities);

var _dialoger = require('dialoger');

var _dialoger2 = _interopRequireDefault(_dialoger);

var _signalEmitter = require('signal-emitter');

var _signalEmitter2 = _interopRequireDefault(_signalEmitter);

var _mappingUtilities = require('mapping-utilities');

var _mappingUtilities2 = _interopRequireDefault(_mappingUtilities);

var _disposer = require('disposer');

var _disposer2 = _interopRequireDefault(_disposer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSettings = {
    defaultImageUrl: '',
    imageShownRatio: '16:9',
    imageShownWidth: 635,
    imageForLineups: false,
    dimensions: [],
    contentTypeIds: [19, 20]
};

var ImagePicker = function ImagePicker(params /*, componentInfo*/) {
    var self = this;

    self.image = params.image;
    self.settings = _jquery2.default.extend({}, defaultSettings, params.settings);
    self.translatedRemoveTitle = _i18next2.default.t('koco-conceptual-image-picker.removeTitle');
    self.settings.defaultImageUrl = _urlUtilities2.default.url(self.settings.defaultImageUrl);

    self.concreteImage = _knockout2.default.pureComputed(function () {
        var result = null;

        var image = _mappingUtilities2.default.toJS(self.image);

        if (image && image.concreteImages && image.concreteImages.length) {
            result = _knockout2.default.utils.arrayFirst(image.concreteImages, isImageShown);
        }

        return result;
    });

    self.koDisposer = new _disposer2.default();
    self.koDisposer.add(self.concreteImage);

    function isImageShown(item) {
        return item.width === self.settings.imageShownWidth && item.dimensionRatio === self.settings.imageShownRatio;
    }

    self.concreteImageUrl = _knockout2.default.pureComputed(function () {
        var result = '';

        if (self.concreteImage()) {
            result = self.concreteImage().mediaLink.href;
        }

        return result;
    });
    self.koDisposer.add(self.concreteImageUrl);

    self.imageAlt = _knockout2.default.pureComputed(function () {
        var result = '';

        if (self.image) {
            if (self.image()) {
                result = self.image().alt;
            }
        }

        return result;
    });
    self.koDisposer.add(self.imageAlt);

    if (self.settings.imageForLineups) {
        _signalEmitter2.default.addListener('image:imageForLineups', function (conceptualImage) {
            self.image(conceptualImage);
        });
    }
};

ImagePicker.prototype.selectImage = function () {
    var self = this;

    var params = {
        conceptualImage: self.image(),
        settings: self.settings
    };

    _dialoger2.default.show('conceptual-image', params).then(function (conceptualImage) {
        if (conceptualImage) {
            self.image(conceptualImage);
        }
    });
};

ImagePicker.prototype.unselectImage = function () {
    this.image(null);
};

ImagePicker.prototype.dispose = function () {
    this.koDisposer.dispose();
};

exports.default = {
    viewModel: {
        createViewModel: function createViewModel(params, componentInfo) {
            return new ImagePicker(params, componentInfo);
        }
    },
    template: _conceptualImagePicker2.default
};