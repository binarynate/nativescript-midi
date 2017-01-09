/**
* Functional mixin pattern by Reg Braithwaite:
* http://raganwald.com/2015/06/17/functional-mixins.html
*/
const shared = Symbol('shared');

function FunctionalMixin (behaviour) {
    const instanceKeys = Reflect.ownKeys(behaviour).filter(key => key !== shared);
    const sharedBehaviour = behaviour[shared] || {};
    const sharedKeys = Reflect.ownKeys(sharedBehaviour);
    const typeTag = Symbol('isA');

    function mixin (target) {
        for (let property of instanceKeys)
            Object.defineProperty(target, property, { value: behaviour[property], writable: true });
        target[typeTag] = true;
        return target;
    }
    for (let property of sharedKeys)
        Object.defineProperty(mixin, property, {
            value: sharedBehaviour[property],
            enumerable: sharedBehaviour.propertyIsEnumerable(property)
        });
    Object.defineProperty(mixin, Symbol.hasInstance, {value: instance => !!instance[typeTag]});
    return mixin;
}

FunctionalMixin.shared = shared;
export default FunctionalMixin;
