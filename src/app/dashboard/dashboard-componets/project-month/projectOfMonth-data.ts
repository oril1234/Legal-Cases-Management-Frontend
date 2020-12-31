export interface Project {
    trClass: string;
    tdWidth: string,
    spanClass: string;
    spanLetter: string;
    image: string;
    name: string;
    designation: string;
    project: string;
    budget: number;
}


export const monthlyProject: Project[] = [


    {
        trClass: '',
        tdWidth: 'width:50px',
        spanClass: 'round',
        spanLetter: 'S',
        image: '',
        name: 'עידן כהן',
        designation: 'Web Designer',
        project: '20',
        budget: 3.9
    },
    {
        trClass: '',
        tdWidth: '',
        spanClass: 'round',
        spanLetter: '',
        image: 'assets/images/users/2.jpg',
        name: 'אבי לוי',
        designation: 'Project Manager',
        project: '18',
        budget: 23.9
    },
    {
        trClass: '',
        tdWidth: 'width:50px',
        spanClass: 'round round-success',
        spanLetter: 'B',
        image: '',
        name: 'עדן בן זקן',
        designation: 'Developer',
        project: '16',
        budget:12.9
    },
    {
        trClass: '',
        tdWidth: 'width:50px',
        spanClass: 'round round-primary',
        spanLetter: 'N',
        image: '',
        name: 'ברי סחרוף',
        designation: 'Web Designer',
        project: '14',
        budget:10.9
    },
    {
        trClass: '',
        tdWidth: '',
        spanClass: 'round round-warning',
        spanLetter: 'M',
        image: '',
        name: 'רמי פורטיס',
        designation: 'Content Writer',
        project: '14',
        budget: 3.9
    },
    {
        trClass: '',
        tdWidth: '',
        spanClass: 'round round-danger',
        spanLetter: 'J',
        image: '',
        name: 'זאב נחמה',
        designation: 'Graphic',
        project: '13',
        budget: 2.6
    },



]