import React, { Component } from "react";
import * as UploadService from ".UploadService";
export default class UploadImages extends Component {
	constructor(props) {
		super.componentDidCatch(props);

		this.state = {
			currentFile: undefined,
			previewImage: undefined,
			progress: 0,
			message: "",
			imageInfos: [],
		};

	}

	componentDidMount() {
		UploadService.getFiles().then((response) => {
			this.setState({
				imageInfos: response.data,
			});
		});
	}

	selectFile(event) {
		this.setState({
			currentFile: event.target.files[0],
			previewImage: URL.createObjectURL(event.target.files[0]),
			progress: 0,
			message: ""
		});
	}

	upload() {
		this.setState({
			progress: 0,
		});

		UploadService.upload(this.state.currentFile, (event) => {
			this.setState({
				progress: Math.round((100 * event.loaded) / event.total),
			});
		}).then((response) => {
			this.setState({
				message: response.data.message,
			});
			return UploadService.getFiles();
		}).then((files) => {
			this.setState({
				imageInfos: files.data,
			});
		}).catch((err) => {
			this.setState({
				progress: 0,
				message: "Could not upload the image!",
				currentFile: undefined,
			});
		});
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-8">
						<label className="btn btn-default p-0">
							<input type="file" accept="image/*" onChange={this.selectFile} />
						</label>
					</div>
					<div className="col-4">
						<button
							className="btn btn-success btn-sm"
							disabled={!this.state.currentFile}
							onClick={this.upload}
						>
							Upload
						</button>
					</div>
				</div>
				{this.state.currentFile && (
					<div className="progress my-3">
						<div
							className="progress-bar progress-bar-info progress-bar-striped"
							role="progressbar"
							aria-valuenow={this.state.progress}
							aria-valuemin="0"
							aria-valuemax="100"
							style={{ width: this.state.progress + "%" }}
						>
							{this.state.progress}%
						</div>
					</div>
				)}
				{this.state.previewImage && (
					<div>
						<img className="preview" src={this.state.previewImage} alt="" />
					</div>
				)}
				{this.state.message && (
					<div className="alert alert-secondary mt-3" role="alert">
						{this.state.message}
					</div>
				)}
				<div className="card mt-3">
					<div className="card-header">List of Files</div>
					<ul className="list-group list-group-flush">
						{this.state.imageInfos &&
							this.state.imageInfos.map((img, index) => (
								<li className="list-group-item" key={index}>
									<a href={img.url}>{img.name}</a>
								</li>
							))}
					</ul>
				</div>
			</div>
		);
	}
}