<?php

require_once('HTTP/Request2.php');

class AnkiServer {
  private $url;

  function __construct($url) {
    $this->url = $url;
  }

  // TODO: should we provide convenience functions we the names and normal arguments?
  // I'm not aware of an automatic way to do it, so my inclination is to let it be.
  function request($func, $args) {
    $req = new HTTP_Request2($this->url .'/'. $func, HTTP_Request2::METHOD_GET);
    $req->setHeader('Content-Type', 'application/json');
    $req->setBody(json_encode($args));
    $res = $req->send();

    if ($res->getStatus() >= 300) {
      throw new AnkiServerException($res->getBody());
    }

    if ($res->getHeader('Content-Type') == 'application/json') {
      return json_decode($res->getBody());
    }

    return $res->getBody();
  }
}

