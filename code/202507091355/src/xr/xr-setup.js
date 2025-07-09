// src/xr/xr-setup.js

let xrSession = null;
let xrRefSpace = null;
let renderer, scene, camera;

function initXR() {
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            if (supported) {
                document.getElementById('start-xr').style.display = 'block';
            }
        });
    }
}

function startXR() {
    navigator.xr.requestSession('immersive-vr').then(onSessionStarted);
}

function onSessionStarted(session) {
    xrSession = session;
    xrSession.addEventListener('end', onSessionEnded);
    
    xrRefSpace = xrSession.requestReferenceSpace('local').then((refSpace) => {
        xrRefSpace = refSpace;
        xrSession.requestAnimationFrame(onXRFrame);
    });
    
    // Set up the renderer for XR
    renderer.xr.enabled = true;
    renderer.xr.setSession(xrSession);
}

function onSessionEnded() {
    xrSession = null;
    document.getElementById('start-xr').style.display = 'none';
}

function onXRFrame(time, frame) {
    const session = frame.session;
    const pose = frame.getViewerPose(xrRefSpace);
    
    if (pose) {
        // Update the scene based on the XR frame
        for (const view of pose.views) {
            const viewport = session.renderState.baseLayer.getViewport(view);
            renderer.setSize(viewport.width, viewport.height);
            renderer.render(scene, camera);
        }
    }
    
    session.requestAnimationFrame(onXRFrame);
}

// Initialize XR on page load
window.addEventListener('load', initXR);

// Add event listener for the XR start button
document.getElementById('start-xr').addEventListener('click', startXR);