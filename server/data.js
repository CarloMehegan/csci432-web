// server/data.js
const committees = [
    { id: 1, 
        name: 'Finance Committee',
         owner: 'Alice Johnson',
        members: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
    },
        { 
            id: 2, 
            name: 'Marketing Committee',
            owner: 'Bob Smith',
            members: ['Bob Smith', 'Charlie Brown', 'David Lee'],
        },
        {
             id: 3, 
             name: 'Operations Committee',
            owner: 'Taylor Swift',
            members: ['Taylor Swift', 'David Lee', 'Ella Fitzgerald'],},
];

export { committees };

const getCommittees = () => {

    return committees;
  };