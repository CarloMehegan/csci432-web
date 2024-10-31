// server/data.js
const committees = [
    { id: 1, name: 'Finance Committee' },
    { id: 2, name: 'Marketing Committee' },
    { id: 3, name: 'Operations Committee' },
];

export const getCommittees = () => {

    return committees;
  };