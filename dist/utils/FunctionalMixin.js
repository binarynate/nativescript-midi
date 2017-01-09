'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
* Functional mixin pattern by Reg Braithwaite:
* http://raganwald.com/2015/06/17/functional-mixins.html
*/
var shared = Symbol('shared');

function FunctionalMixin(behaviour) {
    var instanceKeys = Reflect.ownKeys(behaviour).filter(function (key) {
        return key !== shared;
    });
    var sharedBehaviour = behaviour[shared] || {};
    var sharedKeys = Reflect.ownKeys(sharedBehaviour);
    var typeTag = Symbol('isA');

    function mixin(target) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = instanceKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var property = _step.value;

                Object.defineProperty(target, property, { value: behaviour[property], writable: true });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        target[typeTag] = true;
        return target;
    }
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = sharedKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var property = _step2.value;

            Object.defineProperty(mixin, property, {
                value: sharedBehaviour[property],
                enumerable: sharedBehaviour.propertyIsEnumerable(property)
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    Object.defineProperty(mixin, Symbol.hasInstance, { value: function value(instance) {
            return !!instance[typeTag];
        } });
    return mixin;
}

FunctionalMixin.shared = shared;
exports.default = FunctionalMixin;