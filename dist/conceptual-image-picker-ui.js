(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'jquery', 'knockout', 'i18next', 'koco-url-utilities', 'koco-dialoger', 'koco-signal-emitter', 'koco-mapping-utilities', 'koco-disposer'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('jquery'), require('knockout'), require('i18next'), require('koco-url-utilities'), require('koco-dialoger'), require('koco-signal-emitter'), require('koco-mapping-utilities'), require('koco-disposer'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery, global.knockout, global.i18next, global.kocoUrlUtilities, global.kocoDialoger, global.kocoSignalEmitter, global.kocoMappingUtilities, global.kocoDisposer);
        global.conceptualImagePickerUi = mod.exports;
    }
})(this, function (exports, _jquery, _knockout, _i18next, _kocoUrlUtilities, _kocoDialoger, _kocoSignalEmitter, _kocoMappingUtilities, _kocoDisposer) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _i18next2 = _interopRequireDefault(_i18next);

    var _kocoUrlUtilities2 = _interopRequireDefault(_kocoUrlUtilities);

    var _kocoDialoger2 = _interopRequireDefault(_kocoDialoger);

    var _kocoSignalEmitter2 = _interopRequireDefault(_kocoSignalEmitter);

    var _kocoMappingUtilities2 = _interopRequireDefault(_kocoMappingUtilities);

    var _kocoDisposer2 = _interopRequireDefault(_kocoDisposer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

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
        self.settings.defaultImageUrl = _kocoUrlUtilities2.default.url(self.settings.defaultImageUrl);

        self.concreteImage = _knockout2.default.pureComputed(function () {
            var result = null;

            var image = _kocoMappingUtilities2.default.toJS(self.image);

            if (image && image.concreteImages && image.concreteImages.length) {
                result = _knockout2.default.utils.arrayFirst(image.concreteImages, isImageShown);
            }

            return result;
        });

        self.koDisposer = new _kocoDisposer2.default();
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
            _kocoSignalEmitter2.default.addListener('image:imageForLineups', function (conceptualImage) {
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

        _kocoDialoger2.default.show('conceptual-image', params).then(function (conceptualImage) {
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
        template: template
    };
});