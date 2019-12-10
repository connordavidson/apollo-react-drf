import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Item,
  Label,
  Button,
  Card,
  Divider,
  Dimmer,
  Loader,
  Image,
  Checkbox,
  Icon,

} from 'semantic-ui-react';



class SearchResults extends React.Component {


  handleAddToCart = (data, quantity) => {
    this.setState({ loading: true });
    const {formData} = this.state;
    //filters  the data into the correct format fot the backend
    const variations = []
    this.props.addItemToCart(data, quantity, variations)
    this.setState({loading: false});

  }

  handleFilterDisplayCategoryButtonPressed = (e, data) => {
    console.log('onclick data: ', data)
    if(data.checked){
      //filterCategory is how the checkboxes uncheck when another is checked (the logic is in the 'checked' prop in the checkbox (category === checkedCategory))
      this.setState({
        filterCategory : data.name,
      })
      console.log('handleFilterButtonPressed data.name: ', data.name)
      //creates an array to handleFilterDisplayCategoryButtonPressed the filtered items, and loops through the state.data and compares it to the selected checkbox, if they match it is added to  the filteredData array
      let filteredItems = []
      this.state.data.map( item => {
        if(item.category === data.name){
          filteredItems = filteredItems.concat(item)
        }
      })
      console.log('handleFilterDisplayCategoryButtonPressed filtereditems: ', filteredItems)
      //filterTitle just displays the name of the filter category.. gets appended to the end of the products title on the page
      this.setState({
        filteredData: filteredItems ,
        filterTitle: `, filtered by "${data.name}"`
      })
    }else if (!data.checked){
      //sets the filter category to a blank string (this is incase the user checks the same box again )
      this.setState({
        filterCategory: '',
        filterTitle: ''
      })
    }
  }

  render(){
    return(

      <React.Fragment>
        {loading ? (
          <Segment>
              <Dimmer active inverted>
                <Loader inverted inline='centered'>Loading</Loader>
              </Dimmer>

          </Segment>
        ) : (


          <React.Fragment>

            <Grid.Column width={2}>


              <Header as='h3'>Categories</Header>

                  {/*displays the active categories.. styling needs work*/}
                  <Card.Group>
                    <Card>
                        {//prints all the categories
                        featuredCategories.map(featuredCategories => {
                          return(
                            <Card.Content >
                              <Checkbox
                                label={featuredCategories}
                                float='middle'
                                onClick={(e, data) => {
                                  this.handleFilterDisplayCategoryButtonPressed(e, data)
                                  console.log('category: ', featuredCategories)
                                }}
                                name={featuredCategories}
                                checked={featuredCategories === filterCategory}
                              />
                            </Card.Content>
                          )
                        })}
                    </Card>
                  </Card.Group>

            </Grid.Column>




            <Grid.Column width={12}>
              <React.Fragment>
                <Header as='h1'>{featuredProductsTitle}{filterTitle}</Header>

                <Divider />

                <ItemsCarousel

                  numberOfCards={4}
                  gutter={12}
                  showSlither={true}
                  firstAndLastGutter={true}
                  freeScrolling={false}

                  requestToChangeActive={this.changeActiveItem}
                  activeItemIndex={activeItemIndex}
                  activePosition={'center'}

                  chevronWidth={24}
                  rightChevron={<Icon name='chevron right'/>}
                  leftChevron={<Icon name='chevron left'/>}
                  outsideChevron={true}
                >

                  <Card>
                    <Card.Content>
                      <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                      />
                      <Card.Header>Molly Thomas</Card.Header>
                      <Card.Meta>New User</Card.Meta>
                      <Card.Description>
                        Molly wants to add you to the group <strong>musicians</strong>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green'>
                          Approve
                        </Button>
                        <Button basic color='red'>
                          Decline
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                      />
                      <Card.Header>Molly Thomas</Card.Header>
                      <Card.Meta>New User</Card.Meta>
                      <Card.Description>
                        Molly wants to add you to the group <strong>musicians</strong>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green'>
                          Approve
                        </Button>
                        <Button basic color='red'>
                          Decline
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                      />
                      <Card.Header>Molly Thomas</Card.Header>
                      <Card.Meta>New User</Card.Meta>
                      <Card.Description>
                        Molly wants to add you to the group <strong>musicians</strong>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green'>
                          Approve
                        </Button>
                        <Button basic color='red'>
                          Decline
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                      />
                      <Card.Header>Molly Thomas</Card.Header>
                      <Card.Meta>New User</Card.Meta>
                      <Card.Description>
                        Molly wants to add you to the group <strong>musicians</strong>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green'>
                          Approve
                        </Button>
                        <Button basic color='red'>
                          Decline
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                      />
                      <Card.Header>Molly Thomas</Card.Header>
                      <Card.Meta>New User</Card.Meta>
                      <Card.Description>
                        Molly wants to add you to the group <strong>musicians</strong>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green'>
                          Approve
                        </Button>
                        <Button basic color='red'>
                          Decline
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                      />
                      <Card.Header>Molly Thomas</Card.Header>
                      <Card.Meta>New User</Card.Meta>
                      <Card.Description>
                        Molly wants to add you to the group <strong>musicians</strong>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green'>
                          Approve
                        </Button>
                        <Button basic color='red'>
                          Decline
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

                </ItemsCarousel>

                <Divider />


                <Item.Group divided>

                  { //prints out all the items
                    filterCategory !== '' ?
                    (
                      filteredData.map(item => {
                        return (
                          <Item key={item.id}>
                            <Item.Image
                              src={item.image}
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            />

                            <Item.Content>

                              <Item.Header
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {item.title}
                              </Item.Header>

                              <Item.Meta
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {
                                  item.discount_price !== null ?
                                  <span className='cinema'><s>${item.price}</s> ${item.discount_price}</span> :
                                  <span className='cinema'>${item.price}</span>
                                }

                              </Item.Meta>

                              <Item.Description
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                  {item.description}
                              </Item.Description>

                              <Item.Extra>
                                {
                                  item.variations.length === 0 ?
                                    <Button
                                      primary
                                      floated='right'
                                      icon
                                      onClick={ () => {
                                        this.handleAddToCart(item, 1 )
                                        }
                                      }
                                      >
                                      Quick Add
                                      <Icon name='cart plus' floated='right' />
                                    </Button>
                                    :
                                    <Label
                                      primary
                                      icon
                                      onClick={() => this.props.history.push(`/products/${item.id}`)}
                                      style={{cursor: 'pointer' , float : 'right' }}
                                    >
                                      You need to select a {item.variations[0].name} option before you can order this
                                    </Label>
                                }
                              </Item.Extra>
                            </Item.Content>
                          </Item>
                        )
                      })

                    ):(
                      data.map(item => {
                        // console.log('item from products: ' , item)
                        return (
                          <Item key={item.id}>
                            <Item.Image
                              src={item.image}
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            />

                            <Item.Content>

                              <Item.Header
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {item.title}
                              </Item.Header>

                              <Item.Meta
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {
                                  item.discount_price !== null ?
                                  <span className='cinema'><s>${item.price}</s> ${item.discount_price}</span> :
                                  <span className='cinema'>${item.price}</span>
                                }

                              </Item.Meta>

                              <Item.Description
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                  {item.description}
                              </Item.Description>

                              <Item.Extra>
                                {
                                  item.variations.length === 0 ?
                                    <Button
                                      primary
                                      floated='right'
                                      icon
                                      onClick={ () => {
                                        this.handleAddToCart(item, 1 )
                                        }
                                      }
                                      >
                                      Quick Add
                                      <Icon name='cart plus' floated='right' />
                                    </Button>
                                    :
                                    <Label
                                      primary
                                      icon
                                      onClick={() => this.props.history.push(`/products/${item.id}`)}
                                      style={{cursor: 'pointer' , float : 'right' }}
                                    >
                                      You need to select a {item.variations[0].name} option before you can order this
                                    </Label>
                                }
                              </Item.Extra>
                            </Item.Content>
                          </Item>
                        )
                      })
                    )
                  }
                </Item.Group>
              </React.Fragment>
            </Grid.Column>
          </React.Fragment>
        )}
      </React.Fragment>






    )
  }

}



export default SearchResults
