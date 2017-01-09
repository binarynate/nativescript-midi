## Classes

<dl>
<dt><a href="#NotImplementedError">NotImplementedError</a></dt>
<dd><p>Error that indicates that an abstract or unimplemented method has been invoked.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#name">name</a> : <code>string</code></dt>
<dd></dd>
<dt><a href="#inputPorts">inputPorts</a> : <code>Array.&lt;MidiInputPort&gt;</code></dt>
<dd></dd>
<dt><a href="#outputPorts">outputPorts</a> : <code>Array.&lt;MidiOutputPort&gt;</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#addMessageListener">addMessageListener(messageListener)</a></dt>
<dd><p>Adds a listener that is invoked when any of the device&#39;s output ports sends a message.</p>
</dd>
<dt><a href="#send">send(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Sends the given MIDI bytes to all of the device&#39;s input ports given a Uint8Array or NativeScript buffer containing
MIDI message bytes.</p>
</dd>
<dt><a href="#_log">_log()</a></dt>
<dd></dd>
<dt><a href="#_warn">_warn()</a></dt>
<dd></dd>
<dt><a href="#addDeviceAddedListener">addDeviceAddedListener(callback)</a></dt>
<dd><p>Registers a callback that is invoked when a device is added.</p>
</dd>
<dt><a href="#addDeviceRemovedListener">addDeviceRemovedListener(callback)</a></dt>
<dd><p>Registers a callback that is invoked when a device is removed.</p>
</dd>
<dt><a href="#addDeviceUpdatedListener">addDeviceUpdatedListener(callback)</a></dt>
<dd><p>Registers a callback that is invoked when a device is updated.</p>
<p>An example of an update is that a device that wasn&#39;t previously a MIDI source (i.e. was only
a destination) becomes a MIDI source.</p>
</dd>
<dt><a href="#getDevices">getDevices()</a> ⇒ <code>Promise.&lt;Array.&lt;MidiDevice&gt;&gt;</code></dt>
<dd><p>Gets the available MIDI devices.</p>
</dd>
<dt><a href="#_addDevice">_addDevice(device)</a></dt>
<dd><p>Adds the given device to the device list and notifies listeners of the addition.</p>
</dd>
<dt><a href="#_notifyDeviceAdded">_notifyDeviceAdded(device)</a></dt>
<dd><p>Notifies listeners that the given MIDI device has been added.</p>
</dd>
<dt><a href="#_notifyDeviceRemoved">_notifyDeviceRemoved(device)</a></dt>
<dd><p>Notifies listeners that the given MIDI device has been removed.</p>
</dd>
<dt><a href="#_notifyDeviceUpdated">_notifyDeviceUpdated(device)</a></dt>
<dd><p>Notifies listeners that the given MIDI device has been updated (e.g. removed port, etc).</p>
</dd>
<dt><a href="#_removeDevice">_removeDevice(device)</a></dt>
<dd><p>Removes the given device from the device list and notifies listeners of the removal.</p>
</dd>
<dt><a href="#send">send(options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Sends the given MIDI bytes to the input port given a Uint8Array or NativeScript buffer containing
MIDI message bytes.</p>
</dd>
<dt><a href="#addMessageListener">addMessageListener(messageListener)</a></dt>
<dd><p>Adds a listener that handles MIDI message received from the port.</p>
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

<a name="NotImplementedError"></a>

## NotImplementedError
Error that indicates that an abstract or unimplemented method has been invoked.

**Kind**: global class  
<a name="name"></a>

## name : <code>string</code>
**Kind**: global variable  
<a name="inputPorts"></a>

## inputPorts : <code>Array.&lt;MidiInputPort&gt;</code>
**Kind**: global variable  
<a name="outputPorts"></a>

## outputPorts : <code>Array.&lt;MidiOutputPort&gt;</code>
**Kind**: global variable  
<a name="addMessageListener"></a>

## addMessageListener(messageListener)
Adds a listener that is invoked when any of the device's output ports sends a message.

**Kind**: global function  

| Param | Type |
| --- | --- |
| messageListener | <code>[midiMessageListener](#midiMessageListener)</code> | 

<a name="send"></a>

## send(options) ⇒ <code>Promise</code>
Sends the given MIDI bytes to all of the device's input ports given a Uint8Array or NativeScript buffer containing
MIDI message bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.bytes] | <code>Uin8Array</code> | MIDI message bytes to send.                                                          Required if `bytesReference` is not provided. |
| [options.bytesReference] | <code>interop.Reference</code> | NativeScript reference to the buffer containing the MIDI message bytes to send.                                                          Required if `bytes` is not provided |
| [options.length] | <code>number</code> | Number of bytes. Required if `bytesReference` is provided. |

<a name="_log"></a>

## _log()
**Kind**: global function  
**Access:** protected  
<a name="_warn"></a>

## _warn()
**Kind**: global function  
**Access:** protected  
<a name="addDeviceAddedListener"></a>

## addDeviceAddedListener(callback)
Registers a callback that is invoked when a device is added.

**Kind**: global function  

| Param | Type |
| --- | --- |
| callback | <code>[deviceEventCallback](#deviceEventCallback)</code> | 

<a name="addDeviceRemovedListener"></a>

## addDeviceRemovedListener(callback)
Registers a callback that is invoked when a device is removed.

**Kind**: global function  

| Param | Type |
| --- | --- |
| callback | <code>[deviceEventCallback](#deviceEventCallback)</code> | 

<a name="addDeviceUpdatedListener"></a>

## addDeviceUpdatedListener(callback)
Registers a callback that is invoked when a device is updated.

An example of an update is that a device that wasn't previously a MIDI source (i.e. was only
a destination) becomes a MIDI source.

**Kind**: global function  

| Param | Type |
| --- | --- |
| callback | <code>[deviceEventCallback](#deviceEventCallback)</code> | 

<a name="getDevices"></a>

## *getDevices() ⇒ <code>Promise.&lt;Array.&lt;MidiDevice&gt;&gt;</code>*
Gets the available MIDI devices.

**Kind**: global abstract function  
<a name="_addDevice"></a>

## _addDevice(device)
Adds the given device to the device list and notifies listeners of the addition.

**Kind**: global function  
**Access:** protected  

| Param | Type |
| --- | --- |
| device | <code>MidiDevice</code> | 

<a name="_notifyDeviceAdded"></a>

## _notifyDeviceAdded(device)
Notifies listeners that the given MIDI device has been added.

**Kind**: global function  
**Access:** protected  

| Param | Type |
| --- | --- |
| device | <code>MidiDevice</code> | 

<a name="_notifyDeviceRemoved"></a>

## _notifyDeviceRemoved(device)
Notifies listeners that the given MIDI device has been removed.

**Kind**: global function  
**Access:** protected  

| Param | Type |
| --- | --- |
| device | <code>MidiDevice</code> | 

<a name="_notifyDeviceUpdated"></a>

## _notifyDeviceUpdated(device)
Notifies listeners that the given MIDI device has been updated (e.g. removed port, etc).

**Kind**: global function  
**Access:** protected  

| Param | Type |
| --- | --- |
| device | <code>MidiDevice</code> | 

<a name="_removeDevice"></a>

## _removeDevice(device)
Removes the given device from the device list and notifies listeners of the removal.

**Kind**: global function  
**Access:** protected  

| Param | Type |
| --- | --- |
| device | <code>MidiDevice</code> | 

<a name="send"></a>

## *send(options) ⇒ <code>Promise</code>*
Sends the given MIDI bytes to the input port given a Uint8Array or NativeScript buffer containing
MIDI message bytes.

**Kind**: global abstract function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.bytes] | <code>Uin8Array</code> | MIDI message bytes to send to the device.                                                          Required if `bytesReference` is not provided. |
| [options.bytesReference] | <code>interop.Reference</code> | NativeScript reference to the buffer containing the MIDI message bytes to send.                                                          Required if `bytes` is not provided |
| [options.length] | <code>number</code> | Number of bytes. Required if `bytesReference` is provided. |

<a name="addMessageListener"></a>

## *addMessageListener(messageListener)*
Adds a listener that handles MIDI message received from the port.

**Kind**: global abstract function  

| Param | Type | Description |
| --- | --- | --- |
| messageListener | <code>[midiMessageListener](#midiMessageListener)</code> | Callback that handles an incoming MIDI message from the port. |

<a name="midiMessageListener"></a>

## midiMessageListener : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>Array.&lt;Uint8Array&gt;</code> | Array where each item is a Uint8Array containing a MIDI message. |
| outputPort | <code>MidiOutputPort</code> | Output port from which the bytes were received. |

<a name="deviceEventCallback"></a>

## deviceEventCallback : <code>function</code>
A callback that responds to a device change event.

**Kind**: global typedef  

| Type |
| --- |
| <code>MidiDevice</code> | 

<a name="midiMessageListener"></a>

## midiMessageListener : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>Array.&lt;Uint8Array&gt;</code> | Array where each item is a Uint8Array containing a MIDI message. |
| outputPort | <code>MidiOutputPort</code> | Output port from which the bytes were received. |

