import $ from 'jquery';
import ko from 'knockout';
import i18n from 'i18next';
import urls from 'koco-url-utilities';
import dialoger from 'koco-dialoger';
import emitter from 'koco-signal-emitter';
import koMappingUtilities from 'koco-mapping-utilities';
import KoDisposer from 'koco-disposer';


var defaultSettings = {
    defaultImageUrl: '',
    imageShownRatio: '16:9',
    imageShownWidth: 635,
    imageForLineups: false,
    dimensions: [],
    contentTypeIds: [19, 20]
};

var ImagePicker = function(params /*, componentInfo*/ ) {
    var self = this;

    self.image = params.image;
    self.settings = $.extend({}, defaultSettings, params.settings);
    self.translatedRemoveTitle = i18n.t('koco-conceptual-image-picker.removeTitle');
    self.settings.defaultImageUrl = urls.url(self.settings.defaultImageUrl);

    self.concreteImage = ko.pureComputed(function() {
        var result = null;

        var image = koMappingUtilities.toJS(self.image);

        if (image && image.concreteImages && image.concreteImages.length) {
            result = ko.utils.arrayFirst(
                image.concreteImages,
                isImageShown
            );
        }

        return result;
    });

    self.koDisposer = new KoDisposer();
    self.koDisposer.add(self.concreteImage);

    function isImageShown(item) {
        return item.width === self.settings.imageShownWidth &&
            item.dimensionRatio === self.settings.imageShownRatio;
    }

    self.concreteImageUrl = ko.pureComputed(function() {
        var result = '';

        if (self.concreteImage()) {
            result = self.concreteImage().mediaLink.href;
        }

        return result;
    });
    self.koDisposer.add(self.concreteImageUrl);

    self.imageAlt = ko.pureComputed(function() {
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
        emitter.addListener('image:imageForLineups', function(conceptualImage) {
            self.image(conceptualImage);
        });
    }
};

ImagePicker.prototype.selectImage = function() {
    var self = this;

    var params = {
        conceptualImage: self.image(),
        settings: self.settings
    };

    dialoger.show('conceptual-image', params).then(function(conceptualImage) {
        if (conceptualImage) {
            self.image(conceptualImage);
        }
    });
};

ImagePicker.prototype.unselectImage = function() {
    this.image(null);
};

ImagePicker.prototype.dispose = function() {
    this.koDisposer.dispose();
}

export default {
    viewModel: {
        createViewModel: function(params, componentInfo) {
            return new ImagePicker(params, componentInfo);
        }
    },
    template: template
};
