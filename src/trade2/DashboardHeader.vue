<template>
	
		<b-navbar toggleable="lg" type="dark" variant="light" sticky small class="headbar main" >
			<b-navbar-brand class="text-white"
				:to="`/trade2/${$store.getters.account}`" 
			> &nbsp;<i class="fa fa-home home  ">&nbsp;{{$store.getters.account}}/{{$store.getters.INDEX}}</i>
				&nbsp;{{$store.getters.symbol}}
			</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse">
				<button class="menu" onclick="this.classList.toggle('opened');this.setAttribute('aria-expanded', this.classList.contains('opened'))" aria-label="Main Menu">
      <svg width="40" height="40" viewBox="0 0 100 100">
        <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
        <path class="line line2" d="M 20,50 H 80" />
        <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
      </svg>
    </button>
			</b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav class="justify-content-end ">
			<!-- Right aligned nav items "  -->
					<b-navbar-nav class="ml-auto  " small>
						<div >

		
						<div class="  edit">	
							<b-button secondary class=" btn-sm fa fa-plus" @click="keyIndex=null; showEditor();"></b-button>&nbsp;
							<b-button secondary class="btn-sm fa fa-edit" @click="keyIndex=$store.getters.account;showEditor();"></b-button>&nbsp;
							<b-button secondary class="btn-sm fa fa-exchange-alt" @click="keyIndex=$store.getters.account;showTransfer();"></b-button>&nbsp;
							<b-button secondary class="btn-sm fa fa-trash" @click="keyIndex=$store.getters.account;deleteCurrentKey()"></b-button>&nbsp;
							</div>

							<div class="accs" >	
								<span v-for="KEY in $store.getters.KEY_LIST"  v-bind:key="KEY.key"  >
										<router-link class="btn btn-acc btn-sm d-none"  tag="button"
											:to="`/trade2/${KEY.id}/${$route.params.symbol || ''}`"
											active-class="btn-acc1">
											{{KEY.name}}
										</router-link>
										<a class="btn btn-acc btn-sm " 
											:href="`/coindcxvue/trade2/${KEY.id}/${$route.params.symbol || ''}`"
											:class="{
												'btn-acc1' : (KEY.id == $route.params.account)
											}" >
											{{KEY.name}}
										</a>	&nbsp;
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


<b-modal
      id="modal-prevent-closing-transfer"
      ref="modal-transfer"
      title="Submit Your Detail"
      @show="resetModal"
      @hidden="resetModal"
      @ok="transferOk"
      
    >
      <form ref="form" @submit.stop.prevent="transferSubmit">
        <b-form-group
          label="From"
          label-for="api-account-input"
          invalid-feedback="To/Froma Accounts required"
          :state="transferAccountsState"
          class="acc-modal"
        >
		<b-form-select v-model="transfer.from"  id="from"
            :state="transferAccountsState"
			:options="accounts"></b-form-select>
		<b-form-select v-model="transfer.to"  id="to"
            :state="transferAccountsState"
			:options="accounts"></b-form-select>
        </b-form-group>

        <b-form-group
          label="Cur/Amount"
          label-for="api-cur-amount"
          invalid-feedback="Currency/Amount required"
          :state="transferAmountState"
          class="acc-modal"
        >
          <b-form-input
            id="from"
            v-model="transfer.currency"
            :state="transferAmountState"
            required
          ></b-form-input>
		   <b-form-input
            id="to"
            v-model="transfer.amount"
            :state="transferAmountState"
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
				transferAccountsState : null, transferAmountState : null,
				transfer : {
					from : "", to : "", currency : "POLYX", amount : 49.1
				}
			}
		},
		computed : {
			accounts(){
				return this.$store.getters.KEY_LIST.map((KEY)=>{
						return { value : KEY.account, text : `${KEY.name}(${KEY.email}):${KEY.account}`}
				})
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
				console.log("showEditor")
				let KEYS = this.$store.getters.KEYS;
				this.apiName = KEYS["api_name_" + this.keyIndex];
				this.apiKey = KEYS["api_key_" + this.keyIndex];
				this.apiSecret = KEYS["api_secret_" + this.keyIndex];
				this.$bvModal.show('modal-prevent-closing');
			},
			showTransfer(){
				console.log("showTransfer")
				this.$bvModal.show('modal-prevent-closing-transfer');
			},
			transferOk(bvModalEvt){
				// Prevent modal from closing
				bvModalEvt.preventDefault()
				// Trigger submit handler
				this.transferSubmit()
			},
			transferSubmit() {
				 this.$store.dispatch('makeTransfer',this.transfer);
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
			async handleSubmit() {
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

				let resp = await this.$store.dispatch('getUserInfo',this.transfer);

				localStorage.setItem("api_account_"+this.keyIndex,resp.coindcx_id);
				localStorage.setItem("api_email_"+this.keyIndex,resp.email);

				console.log("resp",resp)
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
			console.log("showEditor",this.keyIndex,this.$store.getters.KEY_LIST)
			setTimeout(()=>{
					if(this.$store.getters.KEY_LIST.length==0){
						this.keyIndex = null;
						console.log("showEditor",this.keyIndex,this.$store.getters.KEY_LIST)
						this.showEditor();	
					}
			},500)
		},
		destroyed() {
			// Removing window resize event listener.
			window.removeEventListener("resize", this.resizeEventHandler);
		},
	})

</script>
<style >

	.headbar.main {
		background-color: transparent!important;
	}

	.home{
		    color: #001b41;
    text-shadow: 1px 1px 4px #989898;

	}
    
    .home:hover{
    	color: #da7e1a;
    
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

		background-color: transparent!important;
		border-color: transparent!important;
		color: #001b41!important;
		text-shadow: 1px 1px 4px #989898;

	}

	 .fa-edit:hover,.fa-plus:hover,.fa-trash:hover{
		color: #da7e1a!important;
		background-color: transparent;
		border-color: transparent!important;
	}

	.fa-edit:focus,.fa-plus:focus,.fa-trash:focus {
		color:  #001b41;
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
    	    color:#071932;
    background-color: white ;
    box-shadow: 0px 0px 3px 3px #d2d2d2;
    border-color: #ffffff00;
    padding-block: 0px;
    margin-bottom: 10px;
}

    .btn-acc:hover{
    	    color: #071932;
    background-color: #ffffff;
    box-shadow: 0px 0px 2px 2px #071932;

    }

    .btn-acc1{
    	          color: white;
    background-color: #071932;
    box-shadow: 0px 0px 3px 3px #d2d2d2;
    border-color: #ffffff00;
    padding-block: 0px;
    margin-bottom: 10px;


    }

    .btn-acc1:hover{
    	color: white;
    background-color: #858584;
   box-shadow: 0px 0px 2px 4px #d2d2d2;
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
    border-color: #590b0b;
    color: grey;
    border: solid;
    border-radius: 4px;
    background-color: gray;


}

   .navbar-toggler-icon:hover{
   	color: #071932;
   	background-color: #071932;
    
  }


.navbar-toggler:focus{
	    box-shadow: none!important;
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

       .btn-primary {
    color: #fff;
    background-color:#000e21;
     border-color: transparent; 
    padding-block: 2px;
    }

     .btn-primary:hover {
    color: #fff;
    background-color: #cb873c;
     border-color: transparent;
     padding-block: 2px;
    
    }

    .btn-secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: transparent;
    padding-block: 2px;
}
    .btn-secondary:hover {
    color: #fff;
    background-color: #cb873c;
    border-color: transparent;
    padding-block: 2px;
}
 .btn-primary:focus ,.btn-primary:active {
    color: #fff;
    background-color: #000e21;
    border-color:#1f749c!important;
    box-shadow: 0 0 0 0.25rem rgb(31 108 143 / 34%);
}          
.menu {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0;
}
.line {
  fill: none;
  stroke: #da7e1a;
  stroke-width: 10!important;
  transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
    stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.line1 {
  stroke-dasharray: 60 207;
  stroke-width: 6;
  stroke: #128961;
}
.line2 {
  stroke-dasharray: 60 60;
  stroke-width: 6;
      stroke: #273b57;
}
.line3 {
  stroke-dasharray: 60 207;
  stroke-width: 6;
  stroke: #a30c0c;
}
.opened .line1 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 6;
}
.opened .line2 {
  stroke-dasharray: 1 60;
  stroke-dashoffset: -30;
  stroke-width: 6;
}
.opened .line3 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 6;
}


	
	
</style>
