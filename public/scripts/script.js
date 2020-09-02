// Backbone Model
Backbone.Model.prototype.idAttribute = "_id";

var Blog = Backbone.Model.extend({
  defaults: {
    author: "",
    title: "",
    url: "",
  },
});

// Backbone Collection

var Blogs = Backbone.Collection.extend({
  url: "http://localhost:3000/api/blogs",
});

// Instantiate a collection
var blogs = new Blogs([]);

// Backbone Views
var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagNmae: "tr",
  initialize: function () {
    this.template = _.template($(".blogs-list-template").html());
  },
  events: {
    "click .edit-blog": "edit",
    "click .update-blog": "update",
    "click .cancel": "cancel",
    "click .delete-blog": "delete",
  },
  edit: function () {
    this.$(".edit-blog").hide();
    this.$(".delete-blog").hide();
    this.$(".update-blog").show();
    this.$(".cancel").show();

    // this section can become an array of fields and be run using a for loop instead
    var author = this.$(".author").html();
    var title = this.$(".title").html();
    var url = this.$(".url").html();

    this.$(".author").html(
      '<input type="text" class="form-control author-update" value="' +
        author +
        '">'
    );
    this.$(".title").html(
      '<input type="text" class="form-control title-update" value="' +
        title +
        '">'
    );
    this.$(".url").html(
      '<input type="text" class="form-control url-update" value="' + url + '">'
    );
  },
  update: function () {
    this.model.set("author", $(".author-update").val());
    this.model.set("url", $(".url-update").val());
    this.model.set("title", $(".title-update").val());

    this.model.save(null, {
      success: function(response) {},
      error: function() {console.log('Failed to update')}
    })
  },
  cancel: function () {
    blogsView.render();
  },
  delete: function () {
    this.model.destroy({ success: function () {}, error: function (err) {
      console.log('failed to delete blog')
    } });
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

var BlogsView = Backbone.View.extend({
  model: blogs,
  el: $(".blogs-list"),
  initialize: function () {
    var self = this;

    // use a timeout for edits to ensure all fields are updated correctly
    var timeoutRender = function () {
      setTimeout(function () {
        self.render();
      }, 30);
    };
    this.model.on("add", this.render, this);
    this.model.on("change", timeoutRender, this);
    this.model.on("remove", this.render, this);

    this.model.fetch({
      success: function (response) {},
      error: function () {
        console.log("Failed to retrieve blogs");
      },
    });
  },
  render: function () {
    var self = this;
    this.$el.html("");
    _.each(this.model.toArray(), function (blog) {
      self.$el.append(new BlogView({ model: blog }).render().$el);
    });
    return this;
  },
});

var blogsView = new BlogsView();

$(document).ready(function () {
  $(".add-blog").on("click", function () {
    var blog = new Blog({
      author: $(".author-input").val(),
      title: $(".title-input").val(),
      url: $(".url-input").val(),
    });
    blogs.add(blog);
    $(".author-input").val("");
    $(".title-input").val("");
    $(".url-input").val("");

    blog.save(null, {
      success: function (response) {
        console.log("successfully saved blog");
      },
      error: function () {
        console.log("Failed to save blog");
      },
    });
  });
});
