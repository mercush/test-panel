import React, { Fragment } from "react";
import "../../style/OmniSearch.css";
import UserCard from "./userCard";
import RepoCard from "./repoCard";
import { isReactNodeEmpty } from "@blueprintjs/core/lib/cjs/common/utils";
const MINIMUM_QUERY_LENGTH = 3; // the minimum number of characters in the trim()'d input needed to submit a search query to the api

const SEARCH_SUBMIT_DELAY_MS = 1000; // millis without subsequent input that must elapse before search query is submitted to api

export default class OmniSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: "github", // github | code-snippets | files
      searchInput: "", // the search query the user has typed in
      snippetResults: [],
      selectedResultType: "",
      selectedResultObject: true,
      userGithubUname: "Albert Einstein",
      userName: null,
      userFollowers: "setia",
      userFollowing: "kset",
      userPublic_repos: "qbraid",
      userAvatarURL:
        "https://www.nobelprize.org/images/einstein-12923-landscape-medium.jpg",
      repoName: "sample",
      repoDescription: "",
      repoStars: 10,
      repoURL: "URL",
      repoData: [],
    };

  }

  componentDidMount() {
    const search = document.getElementById('search-input')
    search.addEventListener('keyup', function(event) {
      console.log('key pressed was '+event.keyCode)
      if (event.keyCode == 13) {
        document.getElementById('searchButton').click()
      }
    })
  }
  // Dropdown Change method:

  handleDropDownChange = (e) => {
    this.setState({ searchType: e.target.value });
  };

  handleSearchInputChange = (event) => {
    if (this.state.searchType === "github") {
      this.setState({
        userName: event.target.value,
        userGithubUname: event.target.value,
      });
    } else if (this.state.searchType === "code-snippets") {
      let searchInput = event.target.value;
    }
  };

  handleSearchButton = () => {
    console.log('this is a test')
    if (this.state.searchType === "github") {
      console.log("in Handle Search Button", this.state.searchType);
      this.handleSubmitGithub();
      this.fetchGithubRepo();
    } else if (this.state.searchType === "code-snippets") {
      console.log("in Handle Search Button");
    }
  };

  // #################################
  // github Search handler methods
  // #################################
  handleSubmitGithub = (e) => {
    this.fetchGithubRepo();
    console.log(
      typeof fetch(`https://api.github.com/users/${this.state.userGithubUname}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.setData(data);
        })
    );
  };
  fetchGithubRepo() {
    fetch(`https://api.github.com/users/${this.state.userGithubUname}/repos`)
      .then((res) => res.json())
      .then((data) => {
        this.constructRepoArray(data);
      });
  }

  setData(data) {
    this.setState(this.state);
    this.setState({
      userGithubUname: data.login,
      userAvatarURL: data.avatar_url,
      userFollowing: data.following,
      userFollowers: data.followers,
      userPublic_repos: data.public_repos,
    });
  }

  constructRepoArray(repo_data) {
    console.log(repo_data);
    console.log(repo_data.length);
    var repo_data_array = [];
    for (var i = 0; i < repo_data.length; i++) {
      console.log(repo_data[i].id)
      let { id, name, description, clone_url } = repo_data[i];
      console.log(name, description, clone_url);
      repo_data_array.push({
        id: id,
        header: name,
        description: description,
        meta: clone_url,
      });
    }

    this.setState({ repoData: repo_data_array });
  }
  handleGitClone = (url, Name) => {
    // console.log("git clone url", url);
    // window.open(url, '_blank').focus();
    fetch(`http://localhost:8888/qbraid-server/get_repo`,
    {
      method: 'POST',
      body: JSON.stringify({
        url: url,
        name: Name
      })
    })
  };
  fetchGithubRepo() {
    fetch(`https://api.github.com/users/${this.state.userGithubUname}/repos`)
      .then((res) => res.json())
      .then((data) => {
        this.constructRepoArray(data);
      });
  }
  // #############################################
  render() {
    return (
      <div className="omnisearch">
        <div className="omnisearch-background" onClick={this.props.close}></div>
        <div>
          <div className="omnisearch-foreground">
              {/* <img className="omnisearch-logo" src="https://www.qbraid.com/assets/images/logo-square.png"></img> */}
              <input
                type="text"
                className="articles-search"
                id="search-input"
                placeholder="Search"
                onChange={this.handleSearchInputChange}
              />
              <select
              className="drop-down"
              name="SearchType"
              id="searchtype"
              onChange={this.handleDropDownChange}
              >
                <option value="github">Github</option>
                <option value="code-snippets">Code-Snippets</option>
                <option value="files">Files</option>
              </select>
            <div
              className="omnisearch-results-pane"
              style={{
                width: this.state.selectedResultObject ? "100%" : "100%",
              }}
            >
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
