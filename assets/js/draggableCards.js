// This file contains the scripts related to dragula. Docs here: https://github.com/bevacqua/dragula

// dragula functions
var drake = dragula([
    document.getElementById('primary-cards'), 
    document.getElementById('secondary-cards'), 
    document.getElementById('asideRoster')], {

    moves: function (el, target, source, sibling) {
        if (el.classList.contains('emptyBoxGuide')) {
            return false
        }
        else {
            return true
        }
    },

    accepts: function (el, target, source, sibling) {

        // don't sort 'primary-cards' if it already has 2 items
        if (target === document.getElementById('primary-cards')) {
            if (target.children.length > 1) {
                return false
            } 
        }

        return true
    }
})

// 
$(document).ready(function() {
    $('body').on('mouseup', function () {
        killDuplicates()
        checkforEmptyDropBoxes()
    })
})

// Player card element ids are based on the MLB PlayerID. This prevents an error when multiple elements with the same ID are created. Whenever there is a mouseup event, this hunts for duplicate ids and destroys the second element.
function killDuplicates () {
    //updateTeam() // so players don't get removed from roster
                    //TODO: write player cards with unique IDs, and use a data-playerID to pass playerID values

    let uniqueList = []    
    let primaryCards = document.getElementById('primary-cards').children
    for (let i = 0; i < primaryCards.length; i ++) {

        let targetId = primaryCards[i].getAttribute('data-id')
        if (!uniqueList.includes(targetId)) {
            uniqueList.push(targetId)
        }
        else {
            primaryCards[i].remove()
            break
        }
    }

    let secondaryCards = document.getElementById('secondary-cards').children
    for (let i = 0; i < secondaryCards.length; i ++) {

        let targetId = secondaryCards[i].getAttribute('data-id')
        if (!uniqueList.includes(targetId)) {
            uniqueList.push(targetId)
        }
        else {
            secondaryCards[i].remove()
            break
        }
    }
    //console.log(uniqueList)
}

// Display message so user knows the box is interactive.
function checkforEmptyDropBoxes() {
    updateEmptyBoxGuide('primary-cards', 'emptyBoxGuidePrimary')
    updateEmptyBoxGuide('secondary-cards', 'emptyBoxGuideSecondary')
}
function updateEmptyBoxGuide(containerId, guideId) {
    const container = document.getElementById(containerId)
    
    // count children, excluding the guide box
    let childrenCount = 0;
    for (let i = 0; i < container.children.length; i++) {
        if (!container.children[i].classList.contains('emptyBoxGuide')) {
            childrenCount++
        }
    }    
    const guideExists = $('#' + guideId).length > 0

    // if no children and no guidebox, create guidebox 
    if (childrenCount == 0 && !guideExists) {
        let emptyBoxGuide = $('<p>')
            .attr('id', guideId)
            .attr('class', 'emptyBoxGuide')
            .text('Drag player cards here.')
        container.appendChild(emptyBoxGuide[0])
    } else if (childrenCount > 0 && guideExists) {
        $('#' + guideId).remove()
    }
}

drake.on('drop', function (el, target, source, sibling) {
    
    killDuplicates()
    checkforEmptyDropBoxes()

    // transform cards into feature and vice versa when dragged to new section
    if (target.id == 'primary-cards') {
        let PlayerId = el.getAttribute('data-id')
        createFeaturePlayerCard(PlayerId, el) //XXX testing
        updateTeam()
    }
    if (target.id == 'secondary-cards') {
        let PlayerId = el.getAttribute('data-id')
        createPlayerCard(PlayerId)
    }
    if (target.id == 'asideSection') {
        getAsideRoster()
    }
    if (source.id == 'asideSection') {
        getAsideRoster()
    }

})

// killing mobile scrolling/navigation when touching 
// $(document).on('touchmove', '#primary-cards, #secondary-cards', function(event) {
//     event.preventDefault()
// }, { passive: false })

// drake.on('drag', function(el, source) {
//     $('body').css('touch-action', 'none')
// })
