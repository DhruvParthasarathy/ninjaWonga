// console.log("js loaded")
// console.log("firebase initialised", firebaseConfig)


document.addEventListener('DOMContentLoaded', function() {

    // const onModalOpenEnd = e => {
    //     console.log("modal Opened")

    //     let datePickerInstance = M.Datepicker.getInstance(datePicker[0]);

    //     console.log(datePickerInstance)

    // }

    const dropDownOpened = () => {

         document.querySelectorAll("#dropdown1>li>a").forEach(element => {
            element.addEventListener(
                'click' , 
                function(){
                   let a = this.innerText
                   document.querySelector('.dropdown-button').placeholder = a
                   document.querySelector('.dropdown-button').innerHTML = a
                   document.querySelector('#parent').value = a


               }
            )
         })


    }

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    var datePicker = document.querySelectorAll('.datepicker');
     M.Datepicker.init(datePicker, {yearRange: 300, maxDate: new Date()});

     var dropDown = document.querySelectorAll('.dropdown-trigger');
     M.Dropdown.init(dropDown, {onOpenEnd: dropDownOpened});



    const form = document.querySelector('form')
    const name = document.querySelector('#name')
    const parent = document.querySelector('#parent')
    const children = document.querySelector('#children')
    const partner = document.querySelector('#partner')

    form.addEventListener('submit', e => {
        e.preventDefault()

        console.log("clicked submit")

        db.collection('familyMembers').add(
            {
                name: name.value,
                parent: parent.value,
                children: children.value,
                partner: partner.value
            }
        )

        let instance = M.Modal.getInstance(elems[0])

        instance.close()

        form.reset()
    })

  });