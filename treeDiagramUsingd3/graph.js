document.addEventListener('DOMContentLoaded', function() {
    const dims = {height : 500, width: window.innerWidth*0.9}

    // setting up svg container with margins outside the graph
    const svg = d3.select('.canvas').append('svg')
    .attr('width', dims.width + 100)
    .attr('height', dims.height + 100)

    // creating the graph
    const graph = svg.append('g').attr('transform', 'translate(0,50)')

    //data strat - we use stratify to convert data to a hierarchial format so that d3 can work with it
    const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent)

    const tree = d3.tree()
    .size([dims.width, dims.height])

    // create ordinal scale
    const colorScale = d3.scaleOrdinal(['#f4511e', '#e91e63'])

    // update function
    const update = (data) => {

        // remove current nodes
        graph.selectAll('.node').remove()
        graph.selectAll('.link').remove()

        // udpate list of parents
        parents.clear()
        data.map(elem => { if(elem.parent !== "" && elem.parent.toLowerCase() !== "none"  ) {parents.add(elem.parent)}} )

        data.map(elem => { if(elem.children !== "" && elem.children.toLowerCase() !== "none" ) {parents.add(elem.children)}} )


        data.map(elem =>  parents.add(elem.name) )



        let dropDownContent = ""

        for(let parentName of parents.entries()){
           dropDownContent+=`<li><a href="#!">${parentName[0]}</a></li>`
        }
   
   
        document.querySelector('.dropdown-content')
        .innerHTML = dropDownContent


        // get updated root node data
        const rootNode = stratify(data)
        // console.log(rootNode)

        // this gives the coordinates for the nodes in the chart
        const treeData = tree(rootNode)

        // get all nodes and join data
        const nodes = graph.selectAll('.node').data(treeData.descendants())

        // get link selection and join data
        const links = graph.selectAll('.link').data(treeData.links())

        // enter new links
        links.enter()
        .append('path')
        // .transition().duration(300)
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y))


        // create a group element for each node in the nodes array
        const enterNodes = nodes.enter()
            .append('g').attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)

        enterNodes.append('rect')
        .attr('fill','#aaa')
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => {

                return 5 * 20
            
        }
        )
        .attr('transform', d => {
            let width = 5 * 20
            return `translate(-${width/2},-30)`
        })

        // append name text
        enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => 
            {
                return (d.data.name.length > 5 ? d.data.name.slice(0,6) + ".." : d.data.name)
            }
            
            
            
            )
    }
    var data = [];

    db.collection('familyMembers').onSnapshot(res => {

        res.docChanges().forEach(
            change => {
                const doc = {...change.doc.data(), id: change.doc.id}

                switch(change.type){
                    case 'added':
                        data.push(doc)
                        break
                    case 'modified' :
                        const index = data.findIndex(item => item.id == doc.id)
                        data[index] = doc
                        break
                    case 'removed' :
                        data = data.filter(item => item.id !== doc.id)
                        break
                    default : 
                        break

                        
                }
            }

        
        )

        update(data)
        
    })

})