document.addEventListener('DOMContentLoaded', () => {
    let userVotedYes = false;
    let userVotedNo = false;

    document.getElementById('vote-yes-button').addEventListener('click', () => {
        const votesYes = document.getElementById('votes-yes');
        const votesNo = document.getElementById('votes-no');

        if (userVotedYes) {
            // If user has already voted "Yes," remove the vote
            votesYes.textContent = parseInt(votesYes.textContent) - 1;
            userVotedYes = false;
        } else {
            // Add "Yes" vote and remove "No" vote if it was selected
            votesYes.textContent = parseInt(votesYes.textContent) + 1;
            if (userVotedNo) {
                votesNo.textContent = parseInt(votesNo.textContent) - 1;
                userVotedNo = false;
            }
            userVotedYes = true;
        }
    });

    document.getElementById('vote-no-button').addEventListener('click', () => {
        const votesYes = document.getElementById('votes-yes');
        const votesNo = document.getElementById('votes-no');

        if (userVotedNo) {
            // If user has already voted "No," remove the vote
            votesNo.textContent = parseInt(votesNo.textContent) - 1;
            userVotedNo = false;
        } else {
            // Add "No" vote and remove "Yes" vote if it was selected
            votesNo.textContent = parseInt(votesNo.textContent) + 1;
            if (userVotedYes) {
                votesYes.textContent = parseInt(votesYes.textContent) - 1;
                userVotedYes = false;
            }
            userVotedNo = true;
        }
    });
});