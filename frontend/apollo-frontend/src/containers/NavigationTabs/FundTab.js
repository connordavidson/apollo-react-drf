
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
  Input,
  Checkbox,
  Icon,
  Message,
  Container,

} from 'semantic-ui-react';
import axios from 'axios';




class FundTab extends React.Component {

  state = {
    loading: false,
    error: false,
    data: [],
    categories: [],
    projectsTitle: 'Featured Projects',
    filterTitle: '',
    filterCategory: '',
    filteredData : [],
    searchBarValue: '',


  }

  componentDidMount() {
    this.setState({
      loading: true
    })

    //this.handleGetProjects();
  }


  render(){
    const {
      loading,
      error,
      data,
      categories,
      projectsTitle,
      filterTitle,
      filterCategory,
      filteredData,
      searchBarValue,

    } = this.state;



    return(

      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Input
              fluid
              icon='search'
              placeholder='Search for a project...'
              onKeyPress={this.handleSearchEnterPress}
              onChange={
                //sets the search value into the value in the state
                (e,data)=>{
                  this.setState({searchBarValue: data.value});
                }
              }
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>

          <Card fluid>

            <Card.Content>
              {/*
                dynamically populate these buttons...
                  have a model in backend 'Project Categories' and change that to display more/less categories
              */}
              <div className='ui eight buttons'>
              <Button
                basic
                color='grey'
               >
                Technology
              </Button>

              <Button
                basic
                color='grey'
              >
                Arts
              </Button>

              <Button
                basic
                color='grey'
              >
                Design
              </Button>

              <Button
                basic
                color='grey'
              >
                Film
              </Button>

              <Button
                basic
                color='grey'
              >
                Food
              </Button>

              <Button
                basic
                color='grey'
              >
                Games
              </Button>

              <Button
                basic
                color='grey'
              >
                Music
              </Button>

              <Button
                basic
                color='grey'
              >
                Publishing
              </Button>
              </div>
            </Card.Content>
          </Card>

        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h1' textAlign='center'>Featured Projects </Header>
            <Divider />
              <Container >
                <Item.Group style={{boder: '20px solid black' }}>
                  <Item>
                    <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                    <Item.Content>
                      <Item.Header as='a'>A Personal Massage Therapist Robot</Item.Header>
                      <Item.Meta>
                        <Label >Technology</Label>
                      </Item.Meta>
                      <Item.Description>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </p>
                      </Item.Description>
                      <Item.Extra>
                        <Label color='green'>130% funded</Label>
                        <Label>Funding Goal: $6500/.75BTC</Label>
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Container>

              <Divider />

              <Container text>
                <Card.Group itemsPerRow={2}>
                  <Card>
                    <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                    <Card.Content>
                      <Card.Header as='a'>A Self Healing Cactus</Card.Header>
                      <Card.Meta>
                        <Label >Botany</Label>
                      </Card.Meta>
                      <Card.Description>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </Card.Description>
                      <Card.Content extra>
                        <Label color='green'>170% funded</Label>
                        <Label>Funding Goal: $10,500/1.25BTC</Label>
                      </Card.Content>
                    </Card.Content>
                  </Card>


                  <Card>
                    <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                    <Card.Content>
                      <Card.Header as='a'>A Water Bottle That Never R..</Card.Header>
                      <Card.Meta>
                        <Label >Magic</Label>
                      </Card.Meta>
                      <Card.Description>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </Card.Description>
                      <Card.Content extra>
                        <Label color='red'>70% funded</Label>
                        <Label>Funding Goal: $6500/.75BTC</Label>
                      </Card.Content>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                    <Card.Content>
                      <Card.Header as='a'>Hydrogen Cell Energy/Cold Fusion</Card.Header>
                      <Card.Meta>
                        <Label >Technology</Label>
                      </Card.Meta>
                      <Card.Description>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </Card.Description>
                      <Card.Content extra>
                        <Label color='red'>10% funded</Label>
                        <Label>Funding Goal: $1500/.25BTC</Label>
                      </Card.Content>
                    </Card.Content>
                  </Card>


                </Card.Group>
              </Container>
          </Grid.Column>

          <Divider />



          <Grid.Column width={8}>
            <Header as='h1' textAlign='center'>Up and coming projects </Header>
            <Divider />
            <Card.Group itemsPerRow={3}>
              <Card>
                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                <Card.Content>
                  <Card.Header as='a'>An iPhone Keyboard App with a Dictionary Built in</Card.Header>
                  <Card.Meta>
                    <Label >Technology</Label>
                  </Card.Meta>
                  <Card.Description>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </Card.Description>
                  <Card.Content extra>
                    <Label color='red'>19% funded</Label>
                    <Label>Funding Goal: $500/.05BTC</Label>
                  </Card.Content>
                </Card.Content>
              </Card>

              <Card>
                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                <Card.Content>
                  <Card.Header as='a'>An Unlimited Energy Source That Runs Off Of MoonLight</Card.Header>
                  <Card.Meta>
                    <Label >Technology</Label>
                  </Card.Meta>
                  <Card.Description>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </Card.Description>
                  <Card.Content extra>
                    <Label color='green'>110% funded</Label>
                    <Label>Funding Goal: $150,000/ 25BTC</Label>
                  </Card.Content>
                </Card.Content>
              </Card>

              <Card>
                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                <Card.Content>
                  <Card.Header as='a'>A Self Driving Car Project</Card.Header>
                  <Card.Meta>
                    <Label >Technology</Label>
                  </Card.Meta>
                  <Card.Description>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </Card.Description>
                  <Card.Content extra>
                    <Label color='red'>28% funded</Label>
                    <Label>Funding Goal: $1000/.15BTC</Label>
                  </Card.Content>
                </Card.Content>
              </Card>

              <Card>
                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                <Card.Content>
                  <Card.Header as='a'>Unlimited Ice</Card.Header>
                  <Card.Meta>
                    <Label >Technology</Label>
                  </Card.Meta>
                  <Card.Description>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </Card.Description>
                  <Card.Content extra>
                    <Label color='red'>69% funded</Label>
                    <Label>Funding Goal: $1000/.15BTC</Label>
                  </Card.Content>
                </Card.Content>
              </Card>

              <Card>
                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                <Card.Content>
                  <Card.Header as='a'>Growing Drugs</Card.Header>
                  <Card.Meta>
                    <Label >Technology</Label>
                  </Card.Meta>
                  <Card.Description>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </Card.Description>
                  <Card.Content extra>
                    <Label color='red'>420% funded</Label>
                    <Label>Funding Goal: $17,000/1.5BTC</Label>
                  </Card.Content>
                </Card.Content>
              </Card>

              etc lol
            </Card.Group>
          </Grid.Column>

        </Grid.Row>


        <Divider />

        <Grid.Row>

          <Container text>
            more content that is sure to pursuade the user to donate money to our customers' projects
          </Container>

        </Grid.Row>


      </Grid>

    )
  }



}


export default FundTab
