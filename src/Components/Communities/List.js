import React, {Component} from 'react';
import axios from "axios";
import {Button} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core';
import {faFireExtinguisher, faMapPin, faTrashAlt, faBullhorn, faAngleRight, faBookmark} from "@fortawesome/free-solid-svg-icons";

library.add(faFireExtinguisher);
library.add(faMapPin);
library.add(faTrashAlt);
library.add(faBullhorn);
library.add(faAngleRight);
library.add(faBookmark);

export default class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            communities: [],
            initialItems: [],
            currentCommunity: {
                waste: {},
                fireStation: {},
                crimeStatistics: {},
                services: {},
                communityName: '',
                communityCode: '',
            }
        };
        this.pipelineByCommunityName = this.pipelineByCommunityName.bind(this);
        this.filterList = this.filterList.bind(this);
    }

    componentDidMount() {
        this.getCommunitiesList()
    }

    async getCommunitiesList() {
        console.log('call getCommunitiesList');

        //await axios.get('http://localhost:1337/list')
        await axios.get('https://data.calgary.ca/resource/kzbm-mn66.json')
            .then(res => {
                this.setState({communities: res.data});
                this.setState({initialItems: res.data});
            })
            .catch(function (error) {
                console.error('error');
            });
    }

    pipelineByCommunityName(e) {
        console.log('call pipelineByCommunityName');

        const communityValue = e.target.dataset.community;
        const communityValueCode = e.target.dataset.code;

        let currentCommunity = {...this.state.currentCommunity};
        currentCommunity.communityName = communityValue;
        currentCommunity.communityCode = communityValueCode;

        this.setState({currentCommunity});

        this.getWasteByCommunityName(communityValue);
        this.getFireStationByCommunityName(communityValue);
        this.getCrimeStatisticsByCommunityName(communityValue);
        this.getServicesByCommunityCode(communityValueCode);

        this.scrollToTop(4);
    }

    scrollToTop(scrollDuration) {
        const   scrollHeight = window.scrollY,
            scrollStep = Math.PI / ( scrollDuration / 15 ),
            cosParameter = scrollHeight / 2;
        let     scrollCount = 0,
            scrollMargin,
            scrollInterval = setInterval( function() {
                if ( window.scrollY != 0 ) {
                    scrollCount = scrollCount + 1;
                    scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
                    window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
                }
                else clearInterval(scrollInterval);
            }, 15 );
    }

    getServicesByCommunityCode(communityValueCode) {
        console.log('call getServicesByCommunityName');

        axios.get('https://data.calgary.ca/resource/4mgb-5v5u.json')
            .then(res => {
                let currentCommunity = {...this.state.currentCommunity};
                currentCommunity.services = res.data.filter((services) => services.comm_code === communityValueCode);
                this.setState({currentCommunity});
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    getCrimeStatisticsByCommunityName(communityName) {
        console.log('call getCrimeStatisticsByCommunityName');

        axios.get('https://data.calgary.ca/resource/kudt-f99k.json')
            .then(res => {
                let currentCommunity = {...this.state.currentCommunity};
                currentCommunity.crimeStatistics = res.data.filter((crimeStatistics) => crimeStatistics.community_name.toUpperCase() === communityName);
                this.setState({currentCommunity});
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    getFireStationByCommunityName(communityName) {
        console.log('call getFireStationByCommunityName');

        axios.get('https://data.calgary.ca/resource/fsqf-xw5a.json')
            .then(res => {
                let currentCommunity = {...this.state.currentCommunity};
                currentCommunity.fireStation = res.data.filter((fireStation) => fireStation.community.toUpperCase() === communityName);
                this.setState({currentCommunity});
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    getWasteByCommunityName(communityName) {
        console.log('call getWasteByCommunityName');

        axios.get('https://data.calgary.ca/resource/g5k5-gjns.json')
            .then(res => {
                let currentCommunity = {...this.state.currentCommunity};
                currentCommunity.waste = res.data.filter((waste) => waste.community.toUpperCase() === communityName);
                this.setState({currentCommunity});
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    getCommunityByName(e) {
        console.log('call getCommunityByName');
        const communityValue = e.target.dataset.community;
        this.setState({communityName: communityValue});

        axios.get('http://localhost:1337/community/' + communityValue)
            .then(res => {
                this.setState({currentCommunity: res.data});
                console.log(res.data);
            })
            .catch(function (error) {
                console.error('error');
            });
    }

    filterList(event) {
        let updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function (item) {
            return item.name.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({communities: updatedList});
    }

    renderServices() {
        if (Object.keys(this.state.currentCommunity.services).length > 0) {
            return (
                <div className="col-md-12">
                    <h4><FontAwesomeIcon icon="bookmark"/> Services</h4>

                    <div className="row">
                        {Object.keys(this.state.currentCommunity.services).map((index) => (
                            <div className="col-md-6">
                                <div className="col-md-12" key='services-row-1-{index}'>
                                    <FontAwesomeIcon
                                        icon="angle-right"/> {this.state.currentCommunity.services[index].name}
                                </div>
                                <div className="col-md-12" key='services-row-2-{index}'>
                                    Type: <b>{this.state.currentCommunity.services[index].type}</b>
                                </div>
                                <div className="col-md-12" key='services-row-3-{index}'>
                                    <FontAwesomeIcon icon="map-pin"/> {this.state.currentCommunity.services[index].address}
                                </div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    renderWaste() {
        if (Object.keys(this.state.currentCommunity.waste).length > 0) {
            return (
                <div className="col-md-12">
                    <h4><FontAwesomeIcon icon="trash-alt"/> Waste</h4>

                    <div className="row">
                        {Object.keys(this.state.currentCommunity.waste).map((index) => (
                            <div className="col-md-12">
                                <div className="col-md-12" key='wst-row-1-{index}'>
                                    <FontAwesomeIcon icon="map-pin"/> {this.state.currentCommunity.waste[index].address}
                                </div>
                                <div className="col-md-12" key='wst-row-2-{index}'>
                                    {this.state.currentCommunity.waste[index].collection_day} - {this.state.currentCommunity.waste[index].commodity}
                                </div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    renderFireStation() {
        if (Object.keys(this.state.currentCommunity.fireStation).length > 0) {
            return (
                <div className="col-md-12">
                    <h4><FontAwesomeIcon icon="fire-extinguisher"/> Fire Station</h4>

                    <div className="row">
                        {Object.keys(this.state.currentCommunity.fireStation).map((index) => (
                            <div className="col-md-12">
                                <div className="row">

                                    <div className="col-md-12" key='fstation-row-1-{index}'>
                                        <br/>
                                        <h5>{this.state.currentCommunity.fireStation[index].name} - <FontAwesomeIcon
                                            icon="map-pin"/> {this.state.currentCommunity.fireStation[index].address}
                                        </h5>
                                    </div>
                                    <div className="col-md-6" key='fstation-row-2-{index}'>
                                        airport_crash_rescue: {this.state.currentCommunity.fireStation[index].airport_crash_rescue}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-3-{index}'>
                                        aquatic_rescue_dive: {this.state.currentCommunity.fireStation[index].aquatic_rescue_dive}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-4-{index}'>
                                        blood_pressure_clinic: {this.state.currentCommunity.fireStation[index].blood_pressure_clinic}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-5-{index}'>
                                        bulk_water_fill: {this.state.currentCommunity.fireStation[index].bulk_water_fill}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-6-{index}'>
                                        chemical_drop_off: {this.state.currentCommunity.fireStation[index].chemical_drop_off}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-7-{index}'>
                                        cholesterol_screening: {this.state.currentCommunity.fireStation[index].cholesterol_screening}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-8-{index}'>
                                        false_alarm: {this.state.currentCommunity.fireStation[index].false_alarm}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-9-{index}'>
                                        fire_station_tour: {this.state.currentCommunity.fireStation[index].fire_station_tour}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-10-{index}'>
                                        fire_suppression: {this.state.currentCommunity.fireStation[index].fire_suppression}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-11-{index}'>
                                        hazardous_condition: {this.state.currentCommunity.fireStation[index].hazardous_condition}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-12-{index}'>
                                        heavy_rescue: {this.state.currentCommunity.fireStation[index].heavy_rescue}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-13-{index}'>
                                        high_angle_rescue: {this.state.currentCommunity.fireStation[index].high_angle_rescue}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-14-{index}'>
                                        hydrant_building_inspection: {this.state.currentCommunity.fireStation[index].hydrant_building_inspection}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-15-{index}'>
                                        investigation: {this.state.currentCommunity.fireStation[index].investigation}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-16-{index}'>
                                        medical_rescue: {this.state.currentCommunity.fireStation[index].medical_rescue}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-17-{index}'>
                                        public_service_assistance: {this.state.currentCommunity.fireStation[index].public_service_assistance}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-18-{index}'>
                                        smoke_detector_program: {this.state.currentCommunity.fireStation[index].smoke_detector_program}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-19-{index}'>
                                        water_safety_patrol: {this.state.currentCommunity.fireStation[index].water_safety_patrol}
                                    </div>
                                    <div className="col-md-6" key='fstation-row-20-{index}'>
                                        winter_sand: {this.state.currentCommunity.fireStation[index].winter_sand}
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    renderCrimeStatistics() {
        if (Object.keys(this.state.currentCommunity.crimeStatistics).length > 0) {
            return (
                <div className="col-md-12">
                    <h4><FontAwesomeIcon icon="bullhorn"/> Crime Statistics</h4>

                    <div className="row">
                        {Object.keys(this.state.currentCommunity.crimeStatistics).map((index) => (
                            <div className="col-md-6">
                                <div className="col-md-12" key='crimeStatistics-row-1-{index}'>
                                    <FontAwesomeIcon
                                        icon="angle-right"/> <b>{this.state.currentCommunity.crimeStatistics[index].category}</b>
                                </div>
                                <div className="col-md-12" key='crimeStatistics-row-2-{index}'>
                                    The number of
                                    crimes: <b>{this.state.currentCommunity.crimeStatistics[index].count}</b>
                                </div>
                                <div className="col-md-12" key='crimeStatistics-row-3-{index}'>
                                    The community
                                    residents: <b>{this.state.currentCommunity.crimeStatistics[index].resident_count}</b>
                                </div>
                                <div className="col-md-12" key='crimeStatistics-row-4-{index}'>
                                    Incidents occurred
                                    in: <b>{this.state.currentCommunity.crimeStatistics[index].month}/{this.state.currentCommunity.crimeStatistics[index].year}</b>
                                </div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    render() {
        return (

            <div id="mount-point" className="container-fluid">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <img src="logo.png" width="250" /><hr/>
                    </div>
                    <div className="col-xs-6 col-md-6  col-lg-4">
                        <div className="col-md-12"><h2>Communities</h2> <input type="text" placeholder="Search" onChange={this.filterList}/></div>

                        <div className="col-md-12 bgBege"></div>

                        <ul>
                            {this.state.communities.map((community, index) => {
                                return (
                                    <li key={index}>
                                        <Button color="link" data-community={community.name} data-code={community.comm_code}
                                                onClick={this.pipelineByCommunityName}>{community.name} - {community.sector}</Button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="col-xs-6 col-md-6 col-lg-8">
                        <div className="row">
                            <div className="col-md-12"><h2>{this.state.currentCommunity.communityName}</h2><br/></div>

                            {this.renderFireStation()}
                            {this.renderCrimeStatistics()}
                            {this.renderWaste()}
                            {this.renderServices()}


                        </div>


                    </div>
                </div>
            </div>


        );
    }
}