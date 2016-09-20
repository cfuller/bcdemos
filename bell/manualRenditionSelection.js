
/**
 * manualRenditionSelection.js plugin
 * 
 * 
 * Dave Bornstein
 */

videojs.plugin('manualRenditionSelection', function() {

    var player = this;
    var representations, repCount;

    var hlsStr = 'application/vnd.apple.mpegurl'
    var dashStr = 'application/dash+xml'

    console.log("manualRenditionSelection")

    player.on('loadedmetadata', function() {
        var player = this
        var selectControl;
        var currentType = player.currentType_

        if (currentType === hlsStr)
            representations = player.hls.representations();
        else if (currentType === dashStr)
            representations = player.dash.representations();
        else {
            console.log('Delivery Format (player.currentType_) is ' + currentType + ". Enabling [auto] only");
            representations = []
        }

        repCount = representations.length;

        var selectControl;
        createUISelector( selectControl )
        selectControl = document.getElementById('selectID');
        selectControl.addEventListener('change', changeQuality);
    });

    function createUISelector(selectControl) {

        selectControl = document.createElement('select');
        var newElement = document.createElement('div');
        var option;

        // dynamically configure the select element and add options
        newElement.id = 'selectID';
        newElement.name = 'quality';
        newElement.className = 'selectStyle vjs-control';

        option = document.createElement('option');
        option.text = 'auto';
        option.value = '-1';
        selectControl.appendChild(option);

        if (representations.length > 0) {

            for (i = 0; i < repCount; i++) {
                var rep = representations[i]

                option = document.createElement('option');
                option.text = rep.bandwidth / 1000 + "k (" + rep.width +
                    "/" + rep.height + ")";
                option.value = i
                selectControl.appendChild(option);
            }

            option = document.createElement('option');
            option.value = '0';
            option.text = 'Low';
            selectControl.appendChild(option);

            option = document.createElement('option');
            option.value = repCount - 1;
            option.text = 'High';
            selectControl.appendChild(option);
        }

        newElement.appendChild(selectControl);
        spacer = document.getElementsByClassName('vjs-spacer')[0];
        spacer.setAttribute("style", "justify-content: flex-end;");
        spacer.appendChild(newElement);

    }


    // function that changes rendition quality
    function changeQuality(evt) {

        theSelect = evt.target;
        selectedQuality = theSelect.options[theSelect.selectedIndex].value;

        for (var rep in representations) {
            if (selectedQuality == rep || selectedQuality == -1)
                representations[rep].enabled(true)
            else
                representations[rep].enabled(false)
        }
    };

});