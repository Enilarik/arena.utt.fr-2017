import React from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import {
  showLoginModal,
  checkLoginStartup
} from '../../actions'

import Button from '../../components/Button'
import Text from '../../components/Text'
import Title from '../../components/Title'
import Footer from '../../components/Footer'
import Contact from './components/Contact'
import Header from './components/Header'
import Intro from './components/Intro'
import Login from './components/Login'
import FestivalPictures from './components/FestivalPictures'
import GMap from './components/GMap'
import Part from './components/Part'
import PartHeader from './components/PartHeader'
import Partners from './components/Partners'
import Timer from './components/Timer'

import './Home.css'

const mapStateToProps = (state) => {
  return {
    modal: state.user.get('modal')
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    showLoginModal() {
      dispatch(showLoginModal())
    },
    checkLoginStartup() {
      dispatch(checkLoginStartup())
    }
  }
}

const Home = (props) => {
  props.checkLoginStartup()

  return (
    <div className="a-home">
      <Login modal={props.modal}></Login>
      <Header arrow="/"></Header>
      <Intro></Intro>
      <Part>
        <Title theme="white" size="h3" center={true}>VENEZ RETROUVER L'AMBIANCE D'UNE LAN PARTY AUTHENTIQUE AVEC VOTRE ÉQUIPE.</Title>
        <Text>
          L'UTT Arena revient pour sa 15ème édition les 8, 9 et 10 décembre 2017. Cette édition aura lieu comme l'année dernière dans le cadre du Festival des Jeux au Cube de Troyes. Au programme 4 tournois sur des incontournables de l'E-sports, du skill, des personnalités et des rencontres, de nombreuses animations et lots à gagner, qui rendront cette édition plus intense et vibrante que jamais.
          Pas fan des jeux proposés ? Pas envie d’être dans un cadre compétitif ? L’UTT Arena propose plein d’animations pour leurs joueurs hors-tournoi !
          Alors récupère ta souris, ton casque et ton câble réseau, branche ton écran et vient imposer la domination de ton équipe dans le Cube.
        </Text>
        <Timer></Timer>
        <Button size="big" theme="orange" onClick={() => props.showLoginModal()}>Connexion</Button>
      </Part>
      <PartHeader id="infos" image="cat1" color="#100d0f">Informations pratiques</PartHeader>
      <Part>
        <Title size="h3">Cashprize</Title>
        <Text theme="orange" className="a-text--left-aligned">
          <br/>
          Les dotations cette année s'élèvent à :<br/><br/>
          League of Legends : <strong>1000€</strong><br/>
          Counter-Strike: Global Offensive : <strong>750€</strong><br/>
          Overwatch : <strong>810€</strong><br/>
          Hearthstone : <strong>135€</strong><br/>
          <br/>
          <br/>
        </Text>
        <Tabs>
          <TabList>
            <Tab><Title theme="orange">Inscription</Title></Tab>
            <Tab><Title theme="orange">Sur Place</Title></Tab>
            <Tab><Title theme="orange">Matériel</Title></Tab>
          </TabList>

          <TabPanel>
            <Text>
              L’inscription se déroule sur ce site. Les équipes sont formées par un capitaine qui crée l’équipe et invite les autres membres.
              <br/>
              Seules les équipes <strong>complètes</strong>, avec <em>chacun des membres ayant payé sa place</em>, seront validées par l’équipe organisatrice.
              <br/>
              Le paiement se réalise en ligne sur une plateforme sécurisée, ou directement sur place pour les joueurs hors-tournoi (avec une majoration de 5€).
              <br/>
              Les mineurs doivent avoir une <strong>autorisation parentale</strong> (obligation légale).
              <br/>
              <br/>
              <mark>Vous êtes accompagné•e par une personne non-joueuse ?</mark> Des places visiteurs en quantité limitée sont disponibles !
            </Text>
          </TabPanel>
          <TabPanel>
            <Text>
              La compétition commence Vendredi à 18h et se déroule au Parc des Expositions de Troyes. Les compétitions commenceront Vendredi dans la soirée.
              Un espace repos vous est reservés, venez avec votre duvet le plus douillet.. si vous comptez dormir.
              Durant 48h non-stop, vous pourrez vous restaurer sur place à prix faible et déguster boissons et mets délicats : sandwichs, pizzas, crêpes sucrées/salées, croque-monsieurs, sodas, boissons sans alcool, énergétiques, et diverses friandises.
            </Text>
          </TabPanel>
          <TabPanel>
            <Text>
              Le matériel fourni est le suivant : une prise électrique et une prise ethernet.
              Vous devez donc apporter une multiprise pour vos écrans, ainsi qu’un câble ethernet d’une longueur minimale de 5 mètres. Des câbles sont disponibles à la vente à prix grande distribution (7€).
              Veuillez aussi apporter une pièce d’identité ainsi que votre place (imprimée ou numérique) qui vous sera envoyée au paiement.
            </Text>
          </TabPanel>
        </Tabs>
        <GMap></GMap>
        <Title>Règlements</Title>
        <Text className="a-text--left-aligned">
          Voici les liens vers les règlements pour les différents tournois. L’équipe se réserve le droit de les modifier.
          <br/>
          <br/>
          <a target="_blank" rel="noopener" href="http://www.mastersjeuvideo.org/files/rules/Annexe_LoL_2016-2017.pdf">Règlement League Of Legends</a>
          <br/>
          <a target="_blank" rel="noopener" href="https://drive.google.com/open?id=1a49iuX5goVjRBU9RynM_3JA084Y8S8Ms">Règlement Hearthstone</a>
          <br/>
          <a target="_blank" rel="noopener" href="http://www.mastersjeuvideo.org/files/rules/Annexe_CSGO_2016-2017.pdf">Règlement Counter-Strike: Global Offensive</a>
          <br/>
          <a target="_blank" rel="noopener" href="https://drive.google.com/file/d/13_vSXoD5g-WgUP3pMJoRh9KZkkeGG8j2/view">Règlement Overwatch</a>
          <br/>
          <br/>
        </Text>
        <Title>Vous n'avez pas d'ordinateur ?</Title>
        <Text>
          Notre partenaire Scoup-Esport met en location des configurations gamers haute-performance ! Nul besoin de transporter une grosse tour, elle sera directement prête à votre arrivée. <a href="http://scoup-esport.fr/boutique/location-utt-arena-2017/">Rendez-vous ici</a> !
        </Text>
      </Part>
      <PartHeader id="festival" image="cat2" color="#110f13">Festival des jeux</PartHeader>
      <Part>
        <Text>
          C’est dans le Cube, salle homologuée, que le Parc des Expositions de Troyes accueille l’UA. En complément de cette belle initiative étudiante, le Parc des Expositions consacre 4 000 m² de superficie à la troisième édition du Festival des Jeux, rendez-vous unique dans l’Aube. Le Festival des Jeux est un événement intergénérationnel qui répond à une demande du public aubois de découvrir, jouer, partager et se rassembler autour de nombreux univers : jeux vidéo, jeux de rôles, jeux de plateau, jeux de figurines, jeux de société, cosplays et bien d’autres encore.
        </Text>
        <FestivalPictures></FestivalPictures>
      </Part>
      <PartHeader id="partners" image="cat3" color="#18181a">Partenaires</PartHeader>
      <Part>
        <Partners></Partners>
      </Part>
      <PartHeader id="contact" image="cat4" color="#22252f">Contact</PartHeader>
      <Part>
        <Contact></Contact>
      </Part>
      <Footer></Footer>
    </div>
  )
}

export default connect(mapStateToProps, mapActionsToProps)(Home)
