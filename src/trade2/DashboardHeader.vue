<template>
	
		<b-navbar toggleable="lg" type="dark" variant="light" sticky small class="headbar main" >
			<b-navbar-brand class="text-white"
				:to="`/trade2/${$store.getters.account}`" 
			> &nbsp;<i class="fa fa-home home  ">&nbsp;{{$store.getters.account}}/{{$store.getters.INDEX}}</i>
				&nbsp;{{$store.getters.symbol}}
			</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav class="justify-content-end ">
			<!-- Right aligned nav items "  -->
					<b-navbar-nav class="ml-auto  " small>
						<div >

		
						<div class="  edit">	
							<b-button secondary class=" btn-sm fa fa-plus" @click="keyIndex=null; showEditor();"></b-button>&nbsp;
							<b-button secondary class="btn-sm fa fa-edit" @click="keyIndex=$store.getters.account;showEditor();"></b-button>&nbsp;
							<b-button secondary class="btn-sm fa fa-trash" @click="keyIndex=$store.getters.account;deleteCurrentKey()"></b-button>&nbsp;
							</div>

							<div class="accs" >	
								<span v-for="KEY in $store.getters.KEY_LIST"  v-bind:key="KEY.key"  >
										<router-link :to="`/trade2/${KEY.id}/${$route.params.symbol || ''}`"
											tag="button" class="btn btn-acc btn-sm" active-class="btn-acc1">
											{{KEY.name}}
										</router-link>&nbsp;
									</span>
							</div>
						</div>	
					</b-navbar-nav>
			</b-collapse>

   <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Submit Your Detail"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <b-form-group
          label="API Name"
          label-for="api-name-input"
          invalid-feedback="ApiName is required"
          :state="apiNameState"
          class="acc-modal"
        >
          <b-form-input
            id="api-key-input"
            v-model="apiName"
            :state="apiNameState"
            required
          ></b-form-input>

        </b-form-group>

        <b-form-group
          label="API Key"
          label-for="api-key-input"
          invalid-feedback="ApiKey is required"
          :state="apiKeyState"
        >
          <b-form-input
            id="api-key-input"
            v-model="apiKey"
            :state="apiKeyState"
            required
          ></b-form-input>

        </b-form-group>

      <b-form-group
          label="API Secret"
          label-for="api-secret-input"
          invalid-feedback="ApiSecret is required"
          :state="apiSecretState"
        >

          <b-form-input
            id="api-secret-input"
            v-model="apiSecret"
            :state="apiSecretState"
            required
          ></b-form-input>

        </b-form-group>

      </form>
    </b-modal>


		</b-navbar>

</template>

<script>

	export default ({
		props: {
			// Header fixed status.
			navbarFixed: {
				type: Boolean,
				default: false,
			},

			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},
			title: {
				type: String,
				default: () => "",
			},
		},
		data() {
			return {
				// Fixed header/sidebar-footer ( Affix component ) top offset.
				top: 0,

				// Search input loading status.
				searchLoading: false,

				// The wrapper element to attach dropdowns to.
				wrapper: document.body,
				apiName : null, apiNameState :  null,
				apiKey : null, apiKeyState : null,
				apiSecret : null, apiSecretState : null,
				keyIndex : 1,
			}
		},
		methods: {
			resizeEventHandler(){
				this.top = this.top ? 0 : -0.01 ;
				// To refresh the header if the window size changes.
				// Reason for the negative value is that it doesn't activate the affix unless
				// scroller is anywhere but the top of the page.
			},
			onSearch(value){
			},

			showEditor(){
				let KEYS = this.$store.getters.KEYS;
				this.apiName = KEYS["api_name_" + this.keyIndex];
				this.apiKey = KEYS["api_key_" + this.keyIndex];
				this.apiSecret = KEYS["api_secret_" + this.keyIndex];
				this.$bvModal.show('modal-prevent-closing');
			},
			checkFormValidity() {
				const valid = this.$refs.form.checkValidity()
				this.apiKeyState = valid
				this.apiSecretState = valid
				return valid
			},
			resetModal() {
				//this.apiKey = ''
				//this.apiKeyState = null;
				//this.apiSecret = ''
				//this.apiSecretState = null
			},
			handleOk(bvModalEvt) {
				// Prevent modal from closing
				bvModalEvt.preventDefault()
				// Trigger submit handler
				this.handleSubmit()
			},
			handleSubmit() {
				// Exit when the form isn't valid
				if (!this.checkFormValidity()) {
					return
				}
				let KEYS = this.$store.getters.KEYS;
				let INDEX = this.$store.getters.INDEX;

				if(!this.keyIndex) this.keyIndex = ++INDEX;

				// Push the name to submitted names
				KEYS["api_name_" + this.keyIndex] = this.apiName;
				KEYS["api_key_" + this.keyIndex] = this.apiKey;
				KEYS["api_secret_" + this.keyIndex] = this.apiSecret;

				localStorage.setItem("api_name_"+this.keyIndex,this.apiName);
				localStorage.setItem("api_key_"+this.keyIndex,this.apiKey);
				localStorage.setItem("api_secret_"+this.keyIndex,this.apiSecret);

				this.$store.commit("KEYS",KEYS);
				this.$store.commit("INDEX",INDEX);

				// Hide the modal manually
				this.$nextTick(() => {
				this.$bvModal.hide('modal-prevent-closing')
				});
				this.$router.push("/trade2/"+this.keyIndex);
				window.location.reload();
			},
			deleteCurrentKey(){

				let KEYS = this.$store.getters.KEYS;
				let INDEX = this.$store.getters.INDEX;

				let name  = KEYS["api_name_" + this.keyIndex] || KEYS["api_key_" + this.keyIndex] ;

				var r = window.confirm("Are you sure you want to delete "+ name);

				if(r==true){
					delete KEYS["api_name_" + this.keyIndex];
					delete KEYS["api_key_" + this.keyIndex];// = this.apiKey;
					delete KEYS["api_secret_" + this.keyIndex];// = this.apiSecret;

					localStorage.removeItem("api_name_"+this.keyIndex);
					localStorage.removeItem("api_key_"+this.keyIndex);
					localStorage.removeItem("api_secret_"+this.keyIndex);
					window.location.reload();
				}

			}


		},
		mounted: function(){
			// Set the wrapper to the proper element, layout wrapper.
			this.wrapper = document.getElementById('layout-dashboard') ;
		},
		created() {
			// Registering window resize event listener to fix affix elements size
			// error while resizing.
			window.addEventListener("resize", this.resizeEventHandler);
		},
		destroyed() {
			// Removing window resize event listener.
			window.removeEventListener("resize", this.resizeEventHandler);
		},
	})

</script>
<style >

	.headbar.main {
		background-color: black!important;
	}
    
    .home:hover{
    	color: orange;
    
     }


   .edit{
   	margin-bottom: 10px;
   	text-align: right;
   	margin-right: 20px;
   }
   .accs{
   	margin-right: 20px;
   }


	.fa-plus , .fa-edit , .fa-trash {

		background-color: transparent;
		border-color: transparent;
		color: white;

	}

	 .fa-edit:hover,.fa-plus:hover,.fa-trash:hover{
		color: orange!important;
		background-color: transparent;
		border-color: transparent!important;
	}

	.fa-edit:focus,.fa-plus:focus,.fa-trash:focus {
		color: white;
		background-color: transparent;
		border-color: transparent;
		box-shadow: none!important;
	} 

	.fa-edit:checked,.fa-plus:checked,.fa-trash:checked {
		color: white;
		background-color: transparent;
		border-color: transparent;
		box-shadow: none!important;
	}

    .btn-acc{
    	border-color: white;
    	color: white;
    }
    .btn-acc:hover{
    	color: #da7e1a;
    }

    .btn-acc1{
    	color: black;
    	background-color: white;
    }
    .btn-acc1:hover{
    	color: white;
    	background-color: #da7e1a;
    }


   @media (max-width:991px){

     .edit {
    align-self: flex-end !important;
    text-align-last: center;
     margin-right: 70px;
     margin-left: 70px;
    margin-bottom: 20px;
    margin-top: -35px
  }
  .accs{
   	margin-left: 20px;
   }
}
  .navbar-toggler-icon {
    display: inline-block;
    width: 25px;
    height: 25px;
    vertical-align: middle;
    border-color: transparent;
      color: #454342;
    border: solid;
    border-radius: 6px;


}

   .navbar-toggler-icon:hover{
   	color: #b65e0e;
   }
.navbar-toggler:focus{
	    box-shadow: none;
}
.navbar-toggler{
	border: none;
}
          
                                               /* Modal editing*/


      .modal-content{
      	border-radius: 20px;
      }


      .modal-title {
    margin-bottom: 0;
    line-height: 1.5;
    font-weight: 800;
     }


   .close{
   	color: #2e2e2e;
    font-size: 35px;
    border: none;
    
    background-color: transparent;
    line-height: 30px;
    font-weight: 700;
   }

   .close:hover{
   	color: orange;
   }



	
	
</style>
