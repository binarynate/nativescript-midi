## Classes

<dl>
<dt><a href="#MidiDevice">MidiDevice</a></dt>
<dd><p>A MIDI device with input ports and output ports through which communication occurs.</p>
</dd>
<dt><a href="#MidiDeviceManager">MidiDeviceManager</a></dt>
<dd><p>Responsible for fetching available MIDI devices and notifying the application of device changes.</p>
</dd>
<dt><a href="#MidiInputPort">MidiInputPort</a></dt>
<dd><p>The input port of a MIDI device which provides a method by which an application can send MIDI messages to the device.</p>
</dd>
<dt><a href="#MidiOutputPort">MidiOutputPort</a></dt>
<dd><p>The output of a MIDI device which notifies the application of messages received from the device.</p>
</dd>
<dt><a href="#NotImplementedError">NotImplementedError</a></dt>
<dd><p>Error that indicates that an abstract or unimplemented method has been invoked.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#midiMessageListener">midiMessageListener</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#deviceEventCallback">deviceEventCallback</a> : <code>function</code></dt>
<dd><p>A callback that responds to a device change event.</p>
</dd>
<dt><a href="#midiMessageListener">midiMessageListener</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="MidiDevice"></a>

## MidiDevice
A MIDI device with input ports and output ports through which communication occurs.

**Kind**: global class  

* [MidiDevice](#MidiDevice)
    * [.name](#MidiDevice+name) : <code>string</code>
    * [.inputPorts](#MidiDevice+inputPorts) : <code>[Array.&lt;MidiInputPort&gt;](#MidiInputPort)</code>
    * [.outputPorts](#MidiDevice+outputPorts) : <code>[Array.&lt;MidiOutputPort&gt;](#MidiOutputPort)</code>
    * [.addMessageListener(messageListener)](#MidiDevice+addMessageListener)
    * [.send(options)](#MidiDevice+send) ⇒ <code>Promise</code>

<a name="MidiDevice+name"></a>

### midiDevice.name : <code>string</code>
**Kind**: instance property of <code>[MidiDevice](#MidiDevice)</code>  
<a name="MidiDevice+inputPorts"></a>

### midiDevice.inputPorts : <code>[Array.&lt;MidiInputPort&gt;](#MidiInputPort)</code>
**Kind**: instance property of <code>[MidiDevice](#MidiDevice)</code>  
<a name="MidiDevice+outputPorts"></a>

### midiDevice.outputPorts : <code>[Array.&lt;MidiOutputPort&gt;](#MidiOutputPort)</code>
**Kind**: instance property of <code>[MidiDevice](#MidiDevice)</code>  
<a name="MidiDevice+addMessageListener"></a>

### midiDevice.addMessageListener(messageListener)
Adds a listener that is invoked when any of the device's output ports sends a message.

**Kind**: instance method of <code>[MidiDevice](#MidiDevice)</code>  

| Param | Type |
| --- | --- |
| messageListener | <code>[midiMessageListener](#midiMessageListener)</code> | 

<a name="MidiDevice+send"></a>

### midiDevice.send(options) ⇒ <code>Promise</code>
Sends the given MIDI bytes to all of the device's input ports given a Uint8Array or NativeScript buffer containing
MIDI message bytes.

**Kind**: instance method of <code>[MidiDevice](#MidiDevice)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.bytes] | <code>Uin8Array</code> | MIDI message bytes to send.                                                          Required if `bytesReference` is not provided. |
| [options.bytesReference] | <code>interop.Reference</code> | NativeScript reference to the buffer containing the MIDI message bytes to send.                                                          Required if `bytes` is not provided |
| [options.length] | <code>number</code> | Number of bytes. Required if `bytesReference` is provided. |

<a name="MidiDeviceManager"></a>

## MidiDeviceManager
Responsible for fetching available MIDI devices and notifying the application of device changes.

**Kind**: global class  

* [MidiDeviceManager](#MidiDeviceManager)
    * [new MidiDeviceManager([options])](#new_MidiDeviceManager_new)
    * [.addDeviceAddedListener(callback)](#MidiDeviceManager+addDeviceAddedListener)
    * [.addDeviceRemovedListener(callback)](#MidiDeviceManager+addDeviceRemovedListener)
    * [.addDeviceUpdatedListener(callback)](#MidiDeviceManager+addDeviceUpdatedListener)
    * *[.getDevices()](#MidiDeviceManager+getDevices) ⇒ <code>Promise.&lt;Array.&lt;MidiDevice&gt;&gt;</code>*

<a name="new_MidiDeviceManager_new"></a>

### new MidiDeviceManager([options])

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> |  |
| [options.logger] | <code>Object</code> | optional logger that implements the Winston logging                                    interface. |

<a name="MidiDeviceManager+addDeviceAddedListener"></a>

### midiDeviceManager.addDeviceAddedListener(callback)
Registers a callback that is invoked when a device is added.

**Kind**: instance method of <code>[MidiDeviceManager](#MidiDeviceManager)</code>  

| Param | Type |
| --- | --- |
| callback | <code>[deviceEventCallback](#deviceEventCallback)</code> | 

<a name="MidiDeviceManager+addDeviceRemovedListener"></a>

### midiDeviceManager.addDeviceRemovedListener(callback)
Registers a callback that is invoked when a device is removed.

**Kind**: instance method of <code>[MidiDeviceManager](#MidiDeviceManager)</code>  

| Param | Type |
| --- | --- |
| callback | <code>[deviceEventCallback](#deviceEventCallback)</code> | 

<a name="MidiDeviceManager+addDeviceUpdatedListener"></a>

### midiDeviceManager.addDeviceUpdatedListener(callback)
Registers a callback that is invoked when a device is updated.

An example of an update is that a device that wasn't previously a MIDI source (i.e. was only
a destination) becomes a MIDI source.

**Kind**: instance method of <code>[MidiDeviceManager](#MidiDeviceManager)</code>  

| Param | Type |
| --- | --- |
| callback | <code>[deviceEventCallback](#deviceEventCallback)</code> | 

<a name="MidiDeviceManager+getDevices"></a>

### *midiDeviceManager.getDevices() ⇒ <code>Promise.&lt;Array.&lt;MidiDevice&gt;&gt;</code>*
Gets the available MIDI devices.

**Kind**: instance abstract method of <code>[MidiDeviceManager](#MidiDeviceManager)</code>  
<a name="MidiInputPort"></a>

## MidiInputPort
The input port of a MIDI device which provides a method by which an application can send MIDI messages to the device.

**Kind**: global class  
<a name="MidiInputPort+send"></a>

### *midiInputPort.send(options) ⇒ <code>Promise</code>*
Sends the given MIDI bytes to the input port given a Uint8Array or NativeScript buffer containing
MIDI message bytes.

**Kind**: instance abstract method of <code>[MidiInputPort](#MidiInputPort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.bytes] | <code>Uin8Array</code> | MIDI message bytes to send to the device.                                                          Required if `bytesReference` is not provided. |
| [options.bytesReference] | <code>interop.Reference</code> | NativeScript reference to the buffer containing the MIDI message bytes to send.                                                          Required if `bytes` is not provided |
| [options.length] | <code>number</code> | Number of bytes. Required if `bytesReference` is provided. |

<a name="MidiOutputPort"></a>

## MidiOutputPort
The output of a MIDI device which notifies the application of messages received from the device.

**Kind**: global class  
<a name="MidiOutputPort+addMessageListener"></a>

### *midiOutputPort.addMessageListener(messageListener)*
Adds a listener that handles MIDI message received from the port.

**Kind**: instance abstract method of <code>[MidiOutputPort](#MidiOutputPort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| messageListener | <code>[midiMessageListener](#midiMessageListener)</code> | Callback that handles an incoming MIDI message from the port. |

<a name="NotImplementedError"></a>

## NotImplementedError
Error that indicates that an abstract or unimplemented method has been invoked.

**Kind**: global class  
<a name="midiMessageListener"></a>

## midiMessageListener : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>Array.&lt;Uint8Array&gt;</code> | Array where each item is a Uint8Array containing a MIDI message. |
| outputPort | <code>[MidiOutputPort](#MidiOutputPort)</code> | Output port from which the bytes were received. |

<a name="deviceEventCallback"></a>

## deviceEventCallback : <code>function</code>
A callback that responds to a device change event.

**Kind**: global typedef  

| Type |
| --- |
| <code>[MidiDevice](#MidiDevice)</code> | 

<a name="midiMessageListener"></a>

## midiMessageListener : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>Array.&lt;Uint8Array&gt;</code> | Array where each item is a Uint8Array containing a MIDI message. |
| outputPort | <code>[MidiOutputPort](#MidiOutputPort)</code> | Output port from which the bytes were received. |

